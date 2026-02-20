import java.util.Scanner;

class ReverseString {
    public static String reverse(String s) {
        char[] arr = s.toCharArray();
        int left = 0, right = arr.length;

        while (left < right) {
            char temp = arr[left];
            arr[left] = arr[right];
            arr[right] = temp;
            left++;
            right--;
        }
        return new String(arr);
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        if (scanner.hasNextLine()) {
            String input = scanner.nextLine();
            System.out.println(reverse(input));
        }
        scanner.close();
    }
}
