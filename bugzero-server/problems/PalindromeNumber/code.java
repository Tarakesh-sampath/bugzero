import java.util.Scanner;

class PalindromeNumber {
    public static boolean isPalindrome(int x) {
        // BUG: Does not correctly handle negative numbers (which are never palindromes)
        // Correct version would be: if (x < 0) return false;
        String s = String.valueOf(x);
        int left = 0, right = s.length() - 1;
        while (left < right) {
            if (s.charAt(left++) != s.charAt(right--))
                return false;
        }
        return true;
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        if (scanner.hasNextInt()) {
            int n = scanner.nextInt();
            System.out.println(isPalindrome(n));
        }
        scanner.close();
    }
}
