import java.util.Scanner;

class BinarySearch_java {
    public static int search(int[] nums, int target) {
        int low = 0, high = nums.length - 1;
        while (low <= high) {
            int mid = low + (high - low) / 2;
            if (nums[mid] == target)
                return mid;
            if (nums[mid] < target) {
                low = mid; // BUG: Should be mid + 1
            } else {
                high = mid; // BUG: Should be mid - 1
            }
        }
        return -1;
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        if (scanner.hasNextInt()) {
            int n = scanner.nextInt();
            int[] nums = new int[n];
            for (int i = 0; i < n; i++)
                nums[i] = scanner.nextInt();
            if (scanner.hasNextInt()) {
                int target = scanner.nextInt();
                System.out.println(search(nums, target));
            }
        }
        scanner.close();
    }
}
