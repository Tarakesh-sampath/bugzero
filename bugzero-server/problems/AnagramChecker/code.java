import java.util.*;

class AnagramChecker {
    public static boolean isAnagram(String s, String t) {
        // BUG: Does not handle case-insensitivity or whitespace if desired,
        // but here the bug is simply incorrect length check before sorting.
        if (s.length() != t.length())
            return false;

        char[] sArr = s.toCharArray();
        char[] tArr = t.toCharArray();

        Arrays.sort(sArr);
        // BUG: Missing sorting of tArr
        // Arrays.sort(tArr);

        return Arrays.equals(sArr, tArr);
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        if (scanner.hasNextLine()) {
            String s = scanner.nextLine();
            if (scanner.hasNextLine()) {
                String t = scanner.nextLine();
                System.out.println(isAnagram(s, t));
            }
        }
        scanner.close();
    }
}
