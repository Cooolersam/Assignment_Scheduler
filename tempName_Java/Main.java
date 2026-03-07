import java.time.LocalDate;

public class Main {
    public static void main(String[] args) {
        /*
        LocalDate currentDate = LocalDate.now();
        int year = currentDate.getYear();
        int month = currentDate.getMonthValue();
        int day = currentDate.getDayOfMonth();
        System.out.println("" + year+month+day);
        System.out.println(year);
        System.out.println(month);
        System.out.println(day);
        System.out.println(currentDate);
        */

        Assignment javaAssignment = new Assignment("Coding assignment", 202731, "APCS", 87, "Projects", 80, 50);
        Pair pair = new Pair(javaAssignment);
        System.out.println(pair.getPriority());
        Assignment otherJavaAssignment = new Assignment("Coding assignment", 202732, "APCS", 87, "Projects", 80, 50);
        Pair otherPair = new Pair(otherJavaAssignment);
        System.out.println(otherPair.getPriority());
    }
}