import java.util.ArrayList;
import java.time.LocalDate;

public class Pair {
    private Assignment newAssignment;
    private int priority;

    public Pair() {
        newAssignment = null;
        priority = 0;
    }

    public Pair(Assignment givenAssignment) {
        this.newAssignment = givenAssignment;
        calculatePriority();
    }

    /*
     * The following function calculates the priority of an assignment based on the class grade,
     * the due date, the category weight, and the assignment weight.
     *
     * The hierarchy of the priority is based on the following order:
     * 1. Class grade
     * 2. Due date
     * 3. Category weight
     * 4. Assignment weight
     *
     * The formula used to calculate priority is as follows:
     * Priority = (100 - CurrentGrade) * 10000 + (-(DueDate-Today)) * 100 + CategoryWeight * 10 + AssignmentWeight
     */

    public void calculatePriority() {
        //get the current date as a concatenated int for easy calculation
        LocalDate currentDate = LocalDate.now();
        String tempIntStr = "";
        tempIntStr += currentDate.getYear();
        tempIntStr += currentDate.getMonthValue();
        tempIntStr += currentDate.getDayOfMonth();
        int dateNow = Integer.parseInt(tempIntStr);

        this.priority = (100-this.newAssignment.getClassGrade())*10000+(-1*(this.newAssignment.getDueDate()-dateNow))*100+this.newAssignment.getCategoryWeight()*10+this.newAssignment.getPointValue();
    }

    public int getPriority() {
        return priority;
    }

    public Assignment getAssignment() {
        return newAssignment;
    }
}