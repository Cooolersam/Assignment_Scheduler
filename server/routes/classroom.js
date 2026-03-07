import axios from 'axios';

const CLASSROOM_API_BASE = 'https://classroom.googleapis.com/v1';

export async function getClassroomData(accessToken) {
  try {
    const headers = {
      'Authorization': `Bearer ${accessToken}`
    };

    // Get list of courses
    const coursesResponse = await axios.get(`${CLASSROOM_API_BASE}/courses`, { headers });
    const courses = coursesResponse.data.courses || [];

    // Get assignments for each course
    const allAssignments = [];

    for (const course of courses) {
      try {
        const assignmentsResponse = await axios.get(
          `${CLASSROOM_API_BASE}/courses/${course.id}/courseWork`,
          { headers }
        );

        const assignments = assignmentsResponse.data.courseWork || [];
        
        const processedAssignments = assignments
          .filter(a => a.workType === 'ASSIGNMENT')
          .map(assignment => ({
            id: assignment.id,
            courseId: course.id,
            courseName: course.name,
            title: assignment.title,
            description: assignment.description,
            dueDate: assignment.dueDate ? new Date(assignment.dueDate).toISOString() : null,
            dueTime: assignment.dueTime && assignment.dueDate 
              ? new Date(`${assignment.dueDate}T${assignment.dueTime.hours}:${assignment.dueTime.minutes}`).toISOString()
              : null,
            status: assignment.state,
            createdTime: assignment.creationTime,
            points: assignment.maxPoints || null
          }));

        // Get student submissions for each assignment
        for (const assignment of processedAssignments) {
          try {
            const submissionsResponse = await axios.get(
              `${CLASSROOM_API_BASE}/courses/${course.id}/courseWork/${assignment.id}/studentSubmissions`,
              { headers }
            );

            const submissions = submissionsResponse.data.studentSubmissions || [];
            const userSubmission = submissions[0]; // Assuming first submission is the current user

            if (userSubmission) {
              assignment.submissionStatus = userSubmission.state;
              assignment.submittedTime = userSubmission.submissionTime;
              assignment.assignedGrade = userSubmission.assignedGrade || null;
            }
          } catch (err) {
            console.error(`Error fetching submissions for assignment ${assignment.id}:`, err.message);
          }
        }

        allAssignments.push(...processedAssignments);
      } catch (err) {
        console.error(`Error fetching assignments for course ${course.id}:`, err.message);
      }
    }

    // Sort by due date
    allAssignments.sort((a, b) => {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate) - new Date(b.dueDate);
    });

    return {
      courses: courses.length,
      assignments: allAssignments,
      lastFetch: new Date().toISOString()
    };
  } catch (err) {
    throw new Error(`Failed to fetch classroom data: ${err.message}`);
  }
}
