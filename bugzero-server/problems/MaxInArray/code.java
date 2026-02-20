import java.util.Scanner;

class MaxInArray {
    public static int findMax(int[] nums) {
        int max = 0;
        for (int i = 0; i <= nums.length; i++) {
            if (nums[i] > max) {
                max = nums[i];
            }
        }
        return max;
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        if (scanner.hasNextInt()) {
            int n = scanner.nextInt();
            int[] nums = new int[n];
            for (int i = 0; i < n; i++) {
                nums[i] = scanner.nextInt();
            }
            System.out.println(findMax(nums));
        }
        scanner.close();
    }
}
