import java.util.ArrayList;
public class Assignment {
    private String assignmentName;
    private String className;
    private String category;
    private int categoryWeight;
    private int pointValue; //how many points the assignment is worth
    private boolean isFinished;

    public Assignment() {
        assignmentName = null;
        className = null;
        category = null;
        categoryWeight = 0;
        pointValue = 0;
        isFinished = false;
    }

    public Assignment(String givenAssignment, String givenClass, String givenCategory, int givenCategoryWeight, int givenPointValue) {
        this.assignmentName = givenAssignment;
        this.className = givenClass;
        this.category = givenCategory;
        this.categoryWeight = givenCategoryWeight;
        this.pointValue = givenPointValue;
    }

    public String getAssignment() {
        return assignmentName;
    }

    public void setAssignmentName(String givenAssignment) {
        this.assignmentName = givenAssignment;
    }

    public String getClassName() {
        return className;
    }

    public void setClassName(String givenClassName) {
        this.className = givenClassName;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String givenCategory) {
        this.category = givenCategory;
    }

    public int getPointValue() {
        return pointValue;
    }

    public void setPointValue(int givenPointValue) {
        this.pointValue = givenPointValue;
    }
}