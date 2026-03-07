import java.util.ArrayList;
public class Scheduler {
    private ArrayList<Pair> assignmentList;

    public Scheduler() {
        assignmentList = new ArrayList<Pair>();
    }

    public void addAssignment(Pair assignment) {
        assignmentList.add(assignment);
    }
}