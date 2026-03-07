import java.util.ArrayList;
public class Assignment {
    private String assignmentName;
    private int dueDate; //formated in yyyymmdd
    private String className;
    private int classGrade;
    private String category;
    private int categoryWeight;
    private int pointValue; //how many points the assignment is worth
    private boolean isFinished;
    private boolean isOverdue;

    public Assignment() {
        assignmentName = null;
        dueDate = 0;
        className = null;
        classGrade = 0;
        category = null;
        categoryWeight = 0;
        pointValue = 0;
        isFinished = false;
        isOverdue = false;
    }

    public Assignment(String givenAssignment, int givenDueDate, String givenClass, int givenGrade, String givenCategory, int givenCategoryWeight, int givenPointValue) {
        this.assignmentName = givenAssignment;
        this.dueDate = givenDueDate;
        this.className = givenClass;
        this.classGrade = givenGrade;
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

    public int getDueDate() {
        return dueDate;
    }

    public void setDueDate(int givenDueDate) {
        this.dueDate = givenDueDate;
    }

    public String getClassName() {
        return className;
    }

    public void setClassName(String givenClassName) {
        this.className = givenClassName;
    }

    public int getClassGrade() {
        return classGrade;
    }

    public void setClassGrade(int givenGrade) {
        this.classGrade = givenGrade;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String givenCategory) {
        this.category = givenCategory;
    }

    public int getCategoryWeight() {
        return categoryWeight;
    }

    public void setCategoryWeight(int givenCategoryWeight) {
        this.categoryWeight = givenCategoryWeight;
    }

    public int getPointValue() {
        return pointValue;
    }

    public void setPointValue(int givenPointValue) {
        this.pointValue = givenPointValue;
    }

    public void finishWorking() {
        this.isFinished = true;
    }

    public void overdue() {
        this.isOverdue = true;
    }
}