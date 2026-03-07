import java.util.ArrayList;
public class Scheduler {
    private ArrayList<Pair> assignmentList;

    public Scheduler() {
        assignmentList = new ArrayList<Pair>();
    }

    public void addAssignment(Pair assignment) {
        if (assignmentList.size() == 0) {
            assignmentList.add(assignment);
        } else {
            int index = 0;
            for (int i=0; i<assignmentList.size(); i++) {
                if (assignment.getPriority() < assignmentList.get(i).getPriority()) {
                    index++;
                }
            }
            assignmentList.add(index, assignment);
        }
    }
}