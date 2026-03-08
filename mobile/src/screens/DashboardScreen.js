import { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, RefreshControl, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const MOCK_ASSIGNMENTS = [
  {
    id: '1',
    title: 'Calculus Problem Set 7',
    courseName: 'AP Calculus BC',
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    submissionStatus: null,
    assignedGrade: null,
    points: 100,
  },
  {
    id: '2',
    title: 'Essay: The Great Gatsby Themes',
    courseName: 'AP English Literature',
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    submissionStatus: null,
    assignedGrade: null,
    points: 50,
  },
  {
    id: '3',
    title: 'Lab Report: Titration Experiment',
    courseName: 'AP Chemistry',
    dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    submissionStatus: null,
    assignedGrade: null,
    points: 75,
  },
  {
    id: '4',
    title: 'Chapter 12 Reading Quiz',
    courseName: 'AP US History',
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    submissionStatus: 'TURNED_IN',
    assignedGrade: 88,
    points: 100,
  },
  {
    id: '5',
    title: 'Recursive Algorithms Assignment',
    courseName: 'AP Computer Science A',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    submissionStatus: 'TURNED_IN',
    assignedGrade: 95,
    points: 100,
  },
  {
    id: '6',
    title: 'Supply & Demand Analysis',
    courseName: 'AP Macroeconomics',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    submissionStatus: null,
    assignedGrade: null,
    points: 60,
  },
  {
    id: '7',
    title: 'Problem Set 5',
    courseName: 'AP Calculus BC',
    dueDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    submissionStatus: 'TURNED_IN',
    assignedGrade: 91,
    points: 100,
  },
  {
    id: '8',
    title: 'Problem Set 6',
    courseName: 'AP Calculus BC',
    dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    submissionStatus: 'TURNED_IN',
    assignedGrade: 84,
    points: 100,
  },
  {
    id: '9',
    title: 'Midterm Exam',
    courseName: 'AP Chemistry',
    dueDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    submissionStatus: 'TURNED_IN',
    assignedGrade: 78,
    points: 100,
  },
  {
    id: '10',
    title: 'Lab Report: Equilibrium',
    courseName: 'AP Chemistry',
    dueDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    submissionStatus: 'TURNED_IN',
    assignedGrade: 45,
    points: 50,
  },
  {
    id: '11',
    title: 'Poetry Analysis',
    courseName: 'AP English Literature',
    dueDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    submissionStatus: 'TURNED_IN',
    assignedGrade: 43,
    points: 50,
  },
  {
    id: '12',
    title: 'DBQ Essay',
    courseName: 'AP US History',
    dueDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    submissionStatus: 'TURNED_IN',
    assignedGrade: 72,
    points: 100,
  },
  {
    id: '13',
    title: 'Unit 3 Test',
    courseName: 'AP US History',
    dueDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    submissionStatus: 'TURNED_IN',
    assignedGrade: 85,
    points: 100,
  },
  {
    id: '14',
    title: 'Binary Trees Lab',
    courseName: 'AP Computer Science A',
    dueDate: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    submissionStatus: 'TURNED_IN',
    assignedGrade: 98,
    points: 100,
  },
  {
    id: '15',
    title: 'GDP & Inflation Problem Set',
    courseName: 'AP Macroeconomics',
    dueDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    submissionStatus: 'TURNED_IN',
    assignedGrade: 55,
    points: 60,
  },
];

function letterGrade(pct) {
  if (pct >= 90) return 'A';
  if (pct >= 80) return 'B';
  if (pct >= 70) return 'C';
  if (pct >= 60) return 'D';
  return 'F';
}

function gradeColor(pct) {
  if (pct >= 90) return '#2E7D52';
  if (pct >= 80) return '#4A7C59';
  if (pct >= 70) return '#92650A';
  if (pct >= 60) return '#B06020';
  return '#B83232';
}

function computeCourseGrades(assignments) {
  const courses = {};
  for (const a of assignments) {
    if (!courses[a.courseName]) {
      courses[a.courseName] = { earned: 0, total: 0, count: 0, pending: 0 };
    }
    if (a.assignedGrade != null && a.points) {
      courses[a.courseName].earned += a.assignedGrade;
      courses[a.courseName].total += a.points;
      courses[a.courseName].count += 1;
    } else {
      courses[a.courseName].pending += 1;
    }
  }
  return Object.entries(courses)
    .map(([name, data]) => ({
      name,
      pct: data.total > 0 ? (data.earned / data.total) * 100 : null,
      earned: data.earned,
      total: data.total,
      gradedCount: data.count,
      pendingCount: data.pending,
    }))
    .sort((a, b) => (b.pct ?? -1) - (a.pct ?? -1));
}

function GradeBar({ pct }) {
  const color = gradeColor(pct);
  return (
    <View style={styles.barTrack}>
      <View style={[styles.barFill, { width: `${Math.min(pct, 100)}%`, backgroundColor: color }]} />
    </View>
  );
}

function CourseGradeCard({ course }) {
  const hasgrades = course.pct !== null;
  const color = hasgrades ? gradeColor(course.pct) : '#617060';
  const letter = hasgrades ? letterGrade(course.pct) : '—';
  const pctText = hasgrades ? `${course.pct.toFixed(1)}%` : 'No grades yet';

  return (
    <View style={styles.gradeCard}>
      <View style={styles.gradeCardTop}>
        <Text style={styles.gradeCourseName} numberOfLines={1}>{course.name}</Text>
        <View style={[styles.letterBadge, { backgroundColor: color + '20' }]}>
          <Text style={[styles.letterText, { color }]}>{letter}</Text>
        </View>
      </View>
      {hasgrades && <GradeBar pct={course.pct} />}
      <View style={styles.gradeCardMeta}>
        <Text style={[styles.gradePct, { color }]}>{pctText}</Text>
        <Text style={styles.gradeDetail}>
          {hasgrades
            ? `${course.earned}/${course.total} pts · ${course.gradedCount} graded`
            : ''}
          {course.pendingCount > 0 ? `  ${course.pendingCount} pending` : ''}
        </Text>
      </View>
    </View>
  );
}

function AssignmentCard({ assignment }) {
  const isSubmitted = assignment.submissionStatus === 'TURNED_IN';
  const isOverdue = assignment.dueDate && new Date(assignment.dueDate) < new Date() && !isSubmitted;

  const statusColor = isSubmitted ? '#2E7D52' : isOverdue ? '#B83232' : '#92650A';
  const statusLabel = isSubmitted ? 'Submitted' : isOverdue ? 'Overdue' : 'Pending';

  const formatDue = () => {
    if (!assignment.dueDate) return 'No due date';
    return new Date(assignment.dueDate).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle} numberOfLines={2}>{assignment.title}</Text>
        <View style={[styles.badge, { backgroundColor: statusColor + '20' }]}>
          <Text style={[styles.badgeText, { color: statusColor }]}>{statusLabel}</Text>
        </View>
      </View>
      <Text style={styles.courseName}>{assignment.courseName}</Text>
      <Text style={styles.dueDate}>Due: {formatDue()}</Text>
      {assignment.assignedGrade != null && (
        <Text style={styles.grade}>Grade: {assignment.assignedGrade} / {assignment.points}</Text>
      )}
    </View>
  );
}

export default function DashboardScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = route.params;

  const [assignments, setAssignments] = useState(MOCK_ASSIGNMENTS);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('assignments');
  const [filter, setFilter] = useState('all');

  const fetchAssignments = () => {
    setRefreshing(true);
    setTimeout(() => {
      setAssignments(MOCK_ASSIGNMENTS);
      setRefreshing(false);
    }, 800);
  };

  useEffect(() => {}, []);

  const calculatePriority = (a) => {
    const today = new Date();
    const daysUntilDue = a.dueDate ? Math.floor((new Date(a.dueDate) - today) / 86400000) : 999;
    const grade = a.assignedGrade && a.points ? (a.assignedGrade / a.points) * 100 : 100;
    return (100 - grade) * 10000 + (-daysUntilDue) * 100 + (a.points || 0);
  };

  const filtered = assignments
    .filter(a => {
      const now = new Date();
      if (filter === 'pending') return a.submissionStatus !== 'TURNED_IN';
      if (filter === 'submitted') return a.submissionStatus === 'TURNED_IN';
      if (filter === 'upcoming') return a.submissionStatus !== 'TURNED_IN' && a.dueDate && new Date(a.dueDate) > now;
      return true;
    })
    .sort((a, b) => calculatePriority(b) - calculatePriority(a));

  const courseGrades = computeCourseGrades(assignments);
  const assignmentFilters = ['all', 'upcoming', 'pending', 'submitted'];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Thoth</Text>
        <TouchableOpacity onPress={() => navigation.replace('Login')}>
          <Text style={styles.logout}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'assignments' && styles.tabActive]}
          onPress={() => setActiveTab('assignments')}
        >
          <Text style={[styles.tabText, activeTab === 'assignments' && styles.tabTextActive]}>Assignments</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'grades' && styles.tabActive]}
          onPress={() => setActiveTab('grades')}
        >
          <Text style={[styles.tabText, activeTab === 'grades' && styles.tabTextActive]}>Grades</Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'assignments' ? (
        <>
          <View style={styles.filterRow}>
            {assignmentFilters.map(f => (
              <TouchableOpacity
                key={f}
                style={[styles.filterBtn, filter === f && styles.filterBtnActive]}
                onPress={() => setFilter(f)}
              >
                <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {loading ? (
            <ActivityIndicator size="large" color="#4A7C59" style={{ marginTop: 40 }} />
          ) : (
            <FlatList
              data={filtered}
              keyExtractor={item => item.id}
              renderItem={({ item }) => <AssignmentCard assignment={item} />}
              contentContainerStyle={styles.list}
              refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchAssignments(); }} tintColor="#4A7C59" />}
              ListEmptyComponent={<Text style={styles.empty}>No assignments found.</Text>}
            />
          )}
        </>
      ) : (
        <ScrollView
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchAssignments(); }} tintColor="#4A7C59" />}
        >
          {courseGrades.map(course => (
            <CourseGradeCard key={course.name} course={course} />
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#EFF4EC' },
  header: {
    backgroundColor: '#FAFDF8',
    paddingTop: 56,
    paddingHorizontal: 20,
    paddingBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#C8D9C4',
  },
  headerTitle: { fontSize: 22, fontWeight: '700', color: '#1C2B1A' },
  logout: { color: '#617060', fontSize: 15 },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: '#FAFDF8',
    borderBottomWidth: 1,
    borderBottomColor: '#C8D9C4',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: { borderBottomColor: '#4A7C59' },
  tabText: { fontSize: 14, fontWeight: '500', color: '#617060' },
  tabTextActive: { color: '#4A7C59', fontWeight: '600' },
  filterRow: {
    flexDirection: 'row',
    padding: 12,
    gap: 8,
    backgroundColor: '#FAFDF8',
  },
  filterBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#C8D9C4',
  },
  filterBtnActive: { backgroundColor: '#4A7C59', borderColor: '#4A7C59' },
  filterText: { color: '#617060', fontSize: 13 },
  filterTextActive: { color: '#fff' },
  list: { padding: 16, gap: 12 },
  card: {
    backgroundColor: '#FAFDF8',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#C8D9C4',
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 },
  cardTitle: { flex: 1, fontSize: 16, fontWeight: '600', color: '#1C2B1A', marginRight: 8 },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  badgeText: { fontSize: 12, fontWeight: '600' },
  courseName: { fontSize: 13, color: '#617060', marginBottom: 4 },
  dueDate: { fontSize: 13, color: '#617060' },
  grade: { fontSize: 13, color: '#2E7D52', marginTop: 4, fontWeight: '600' },
  empty: { textAlign: 'center', color: '#617060', marginTop: 40 },
  gradeCard: {
    backgroundColor: '#FAFDF8',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#C8D9C4',
    gap: 10,
  },
  gradeCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  gradeCourseName: { flex: 1, fontSize: 15, fontWeight: '600', color: '#1C2B1A', marginRight: 12 },
  letterBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  letterText: { fontSize: 16, fontWeight: '700' },
  barTrack: { height: 6, backgroundColor: '#E0EAD8', borderRadius: 3, overflow: 'hidden' },
  barFill: { height: 6, borderRadius: 3 },
  gradeCardMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  gradePct: { fontSize: 14, fontWeight: '600' },
  gradeDetail: { fontSize: 12, color: '#617060' },
});
