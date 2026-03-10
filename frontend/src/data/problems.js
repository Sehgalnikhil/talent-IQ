export const PROBLEMS = {
  "two-sum": {
    id: "two-sum",
    title: "Two Sum",
    difficulty: "Easy",
    category: "Array • Hash Table",
    description: {
      text: "Given an array of integers nums and an integer target, return indices of the two numbers in the array such that they add up to target.",
      notes: [
        "You may assume that each input would have exactly one solution, and you may not use the same element twice.",
        "You can return the answer in any order.",
      ],
    },
    hints: [
      "A really slow way to solve this is to use a double for loop.",
      "A much more efficient way is to use a Hash Map to store the values and their indices as you iterate."
    ],
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
      },
      {
        input: "nums = [3,2,4], target = 6",
        output: "[1,2]",
      },
      {
        input: "nums = [3,3], target = 6",
        output: "[0,1]",
      },
    ],
    constraints: [
      "2 ≤ nums.length ≤ 10⁴",
      "-10⁹ ≤ nums[i] ≤ 10⁹",
      "-10⁹ ≤ target ≤ 10⁹",
      "Only one valid answer exists",
    ],
    starterCode: {
      javascript: `function twoSum(nums, target) {
  // Write your solution here
  
}

// Test cases
console.log(twoSum([2, 7, 11, 15], 9)); // Expected: [0, 1]
console.log(twoSum([3, 2, 4], 6)); // Expected: [1, 2]
console.log(twoSum([3, 3], 6)); // Expected: [0, 1]`,
      python: `def twoSum(nums, target):
    # Write your solution here
    pass

# Test cases
print(twoSum([2, 7, 11, 15], 9))  # Expected: [0, 1]
print(twoSum([3, 2, 4], 6))  # Expected: [1, 2]
print(twoSum([3, 3], 6))  # Expected: [0, 1]`,
      java: `import java.util.*;

class Solution {
    public static int[] twoSum(int[] nums, int target) {
        // Write your solution here
        
        return new int[0];
    }
    
    public static void main(String[] args) {
        System.out.println(Arrays.toString(twoSum(new int[]{2, 7, 11, 15}, 9))); // Expected: [0, 1]
        System.out.println(Arrays.toString(twoSum(new int[]{3, 2, 4}, 6))); // Expected: [1, 2]
        System.out.println(Arrays.toString(twoSum(new int[]{3, 3}, 6))); // Expected: [0, 1]
    }
}`,
    },
    expectedOutput: {
      javascript: "[0,1]\n[1,2]\n[0,1]",
      python: "[0, 1]\n[1, 2]\n[0, 1]",
      java: "[0, 1]\n[1, 2]\n[0, 1]",
    },
  },

  "reverse-string": {
    id: "reverse-string",
    title: "Reverse String",
    difficulty: "Easy",
    category: "String • Two Pointers",
    description: {
      text: "Write a function that reverses a string. The input string is given as an array of characters s.",
      notes: ["You must do this by modifying the input array in-place with O(1) extra memory."],
    },
    examples: [
      {
        input: 's = ["h","e","l","l","o"]',
        output: '["o","l","l","e","h"]',
      },
      {
        input: 's = ["H","a","n","n","a","h"]',
        output: '["h","a","n","n","a","H"]',
      },
    ],
    constraints: ["1 ≤ s.length ≤ 10⁵", "s[i] is a printable ascii character"],
    starterCode: {
      javascript: `function reverseString(s) {
  // Write your solution here
  
}

// Test cases
let test1 = ["h","e","l","l","o"];
reverseString(test1);
console.log(test1); // Expected: ["o","l","l","e","h"]

let test2 = ["H","a","n","n","a","h"];
reverseString(test2);
console.log(test2); // Expected: ["h","a","n","n","a","H"]`,
      python: `def reverseString(s):
    # Write your solution here
    pass

# Test cases
test1 = ["h","e","l","l","o"]
reverseString(test1)
print(test1)  # Expected: ["o","l","l","e","h"]

test2 = ["H","a","n","n","a","h"]
reverseString(test2)
print(test2)  # Expected: ["h","a","n","n","a","H"]`,
      java: `import java.util.*;

class Solution {
    public static void reverseString(char[] s) {
        // Write your solution here
        
    }
    
    public static void main(String[] args) {
        char[] test1 = {'h','e','l','l','o'};
        reverseString(test1);
        System.out.println(Arrays.toString(test1)); // Expected: [o, l, l, e, h]
        
        char[] test2 = {'H','a','n','n','a','h'};
        reverseString(test2);
        System.out.println(Arrays.toString(test2)); // Expected: [h, a, n, n, a, H]
    }
}`,
    },
    expectedOutput: {
      javascript: '["o","l","l","e","h"]\n["h","a","n","n","a","H"]',
      python: "['o', 'l', 'l', 'e', 'h']\n['h', 'a', 'n', 'n', 'a', 'H']",
      java: "[o, l, l, e, h]\n[h, a, n, n, a, H]",
    },
  },

  "valid-palindrome": {
    id: "valid-palindrome",
    title: "Valid Palindrome",
    difficulty: "Easy",
    category: "String • Two Pointers",
    description: {
      text: "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.",
      notes: ["Given a string s, return true if it is a palindrome, or false otherwise."],
    },
    examples: [
      {
        input: 's = "A man, a plan, a canal: Panama"',
        output: "true",
        explanation: '"amanaplanacanalpanama" is a palindrome.',
      },
      {
        input: 's = "race a car"',
        output: "false",
        explanation: '"raceacar" is not a palindrome.',
      },
      {
        input: 's = " "',
        output: "true",
        explanation:
          's is an empty string "" after removing non-alphanumeric characters. Since an empty string reads the same forward and backward, it is a palindrome.',
      },
    ],
    constraints: ["1 ≤ s.length ≤ 2 * 10⁵", "s consists only of printable ASCII characters"],
    starterCode: {
      javascript: `function isPalindrome(s) {
  // Write your solution here
  
}

// Test cases
console.log(isPalindrome("A man, a plan, a canal: Panama")); // Expected: true
console.log(isPalindrome("race a car")); // Expected: false
console.log(isPalindrome(" ")); // Expected: true`,
      python: `def isPalindrome(s):
    # Write your solution here
    pass

# Test cases
print(isPalindrome("A man, a plan, a canal: Panama"))  # Expected: True
print(isPalindrome("race a car"))  # Expected: False
print(isPalindrome(" "))  # Expected: True`,
      java: `class Solution {
    public static boolean isPalindrome(String s) {
        // Write your solution here
        
        return false;
    }
    
    public static void main(String[] args) {
        System.out.println(isPalindrome("A man, a plan, a canal: Panama")); // Expected: true
        System.out.println(isPalindrome("race a car")); // Expected: false
        System.out.println(isPalindrome(" ")); // Expected: true
    }
}`,
    },
    expectedOutput: {
      javascript: "true\nfalse\ntrue",
      python: "True\nFalse\nTrue",
      java: "true\nfalse\ntrue",
    },
  },

  "maximum-subarray": {
    id: "maximum-subarray",
    title: "Maximum Subarray",
    difficulty: "Medium",
    category: "Array • Dynamic Programming",
    description: {
      text: "Given an integer array nums, find the subarray with the largest sum, and return its sum.",
      notes: [],
    },
    examples: [
      {
        input: "nums = [-2,1,-3,4,-1,2,1,-5,4]",
        output: "6",
        explanation: "The subarray [4,-1,2,1] has the largest sum 6.",
      },
      {
        input: "nums = [1]",
        output: "1",
        explanation: "The subarray [1] has the largest sum 1.",
      },
      {
        input: "nums = [5,4,-1,7,8]",
        output: "23",
        explanation: "The subarray [5,4,-1,7,8] has the largest sum 23.",
      },
    ],
    constraints: ["1 ≤ nums.length ≤ 10⁵", "-10⁴ ≤ nums[i] ≤ 10⁴"],
    starterCode: {
      javascript: `function maxSubArray(nums) {
  // Write your solution here
  
}

// Test cases
console.log(maxSubArray([-2,1,-3,4,-1,2,1,-5,4])); // Expected: 6
console.log(maxSubArray([1])); // Expected: 1
console.log(maxSubArray([5,4,-1,7,8])); // Expected: 23`,
      python: `def maxSubArray(nums):
    # Write your solution here
    pass

# Test cases
print(maxSubArray([-2,1,-3,4,-1,2,1,-5,4]))  # Expected: 6
print(maxSubArray([1]))  # Expected: 1
print(maxSubArray([5,4,-1,7,8]))  # Expected: 23`,
      java: `class Solution {
    public static int maxSubArray(int[] nums) {
        // Write your solution here
        
        return 0;
    }
    
    public static void main(String[] args) {
        System.out.println(maxSubArray(new int[]{-2,1,-3,4,-1,2,1,-5,4})); // Expected: 6
        System.out.println(maxSubArray(new int[]{1})); // Expected: 1
        System.out.println(maxSubArray(new int[]{5,4,-1,7,8})); // Expected: 23
    }
}`,
    },
    expectedOutput: {
      javascript: "6\n1\n23",
      python: "6\n1\n23",
      java: "6\n1\n23",
    },
  },

  "container-with-most-water": {
    id: "container-with-most-water",
    title: "Container With Most Water",
    difficulty: "Medium",
    category: "Array • Two Pointers",
    description: {
      text: "You are given an integer array height of length n. There are n vertical lines drawn such that the two endpoints of the ith line are (i, 0) and (i, height[i]).",
      notes: [
        "Find two lines that together with the x-axis form a container, such that the container contains the most water.",
        "Return the maximum amount of water a container can store.",
        "Notice that you may not slant the container.",
      ],
    },
    examples: [
      {
        input: "height = [1,8,6,2,5,4,8,3,7]",
        output: "49",
        explanation:
          "The vertical lines are represented by array [1,8,6,2,5,4,8,3,7]. In this case, the max area of water the container can contain is 49.",
      },
      {
        input: "height = [1,1]",
        output: "1",
      },
    ],
    constraints: ["n == height.length", "2 ≤ n ≤ 10⁵", "0 ≤ height[i] ≤ 10⁴"],
    starterCode: {
      javascript: `function maxArea(height) {
  // Write your solution here
  
}

// Test cases
console.log(maxArea([1,8,6,2,5,4,8,3,7])); // Expected: 49
console.log(maxArea([1,1])); // Expected: 1`,
      python: `def maxArea(height):
    # Write your solution here
    pass

# Test cases
print(maxArea([1,8,6,2,5,4,8,3,7]))  # Expected: 49
print(maxArea([1,1]))  # Expected: 1`,
      java: `class Solution {
    public static int maxArea(int[] height) {
        // Write your solution here
        
        return 0;
    }
    
    public static void main(String[] args) {
        System.out.println(maxArea(new int[]{1,8,6,2,5,4,8,3,7})); // Expected: 49
        System.out.println(maxArea(new int[]{1,1})); // Expected: 1
    }
}`,
    },
    expectedOutput: {
      javascript: "49\n1",
      python: "49\n1",
      java: "49\n1",
    },
  },

  "valid-parentheses": {
    id: "valid-parentheses",
    title: "Valid Parentheses",
    difficulty: "Easy",
    category: "String • Stack",
    description: {
      text: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
      notes: ["An input string is valid if: Open brackets must be closed by the same type of brackets, and Open brackets must be closed in the correct order."]
    },
    examples: [
      { input: "s = '()'", output: "true" },
      { input: "s = '()[]{}'", output: "true" },
      { input: "s = '(]'", output: "false" }
    ],
    constraints: ["1 ≤ s.length ≤ 10⁴", "s consists of parentheses only '()[]{}'."],
    starterCode: {
      javascript: "function isValid(s) {\n  // Write your solution here\n  \n}",
      python: "def isValid(s):\n    # Write your solution here\n    pass",
      java: "class Solution {\n    public static boolean isValid(String s) {\n        // Write your solution here\n        return false;\n    }\n}"
    },
    expectedOutput: { javascript: "true\ntrue\nfalse", python: "True\nTrue\nFalse", java: "true\ntrue\nfalse" }
  },

  "merge-two-sorted-lists": {
    id: "merge-two-sorted-lists",
    title: "Merge Two Sorted Lists",
    difficulty: "Easy",
    category: "Linked List",
    description: {
      text: "You are given the heads of two sorted linked lists list1 and list2. Merge the two lists in a one sorted list.",
      notes: ["The list should be made by splicing together the nodes of the first two lists."]
    },
    examples: [
      { input: "list1 = [1,2,4], list2 = [1,3,4]", output: "[1,1,2,3,4,4]" }
    ],
    constraints: ["The number of nodes in both lists is in the range [0, 50]."],
    starterCode: {
      javascript: "function mergeTwoLists(list1, list2) {\n  // Write your solution here\n  \n}",
      python: "def mergeTwoLists(list1, list2):\n    # Write your solution here\n    pass",
      java: "class Solution {\n    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {\n        // Write your solution here\n        return null;\n    }\n}"
    },
    expectedOutput: { javascript: "[1,1,2,3,4,4]", python: "[1, 1, 2, 3, 4, 4]", java: "[1, 1, 2, 3, 4, 4]" }
  },

  "contains-duplicate": {
    id: "contains-duplicate",
    title: "Contains Duplicate",
    difficulty: "Easy",
    category: "Array • Hash Table",
    description: {
      text: "Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.",
      notes: []
    },
    examples: [
      { input: "nums = [1,2,3,1]", output: "true" },
      { input: "nums = [1,2,3,4]", output: "false" }
    ],
    constraints: ["1 ≤ nums.length ≤ 10⁵"],
    starterCode: {
      javascript: "function containsDuplicate(nums) {\n  // Write your solution here\n  \n}",
      python: "def containsDuplicate(nums):\n    # Write your solution here\n    pass",
      java: "class Solution {\n    public boolean containsDuplicate(int[] nums) {\n        // Write your solution here\n        return false;\n    }\n}"
    },
    expectedOutput: { javascript: "true\nfalse", python: "True\nFalse", java: "true\nfalse" }
  },

  "single-number": {
    id: "single-number",
    title: "Single Number",
    difficulty: "Easy",
    category: "Array • Bit Manipulation",
    description: {
      text: "Given a non-empty array of integers nums, every element appears twice except for one. Find that single one.",
      notes: ["You must implement a solution with a linear runtime complexity and use only constant extra space."]
    },
    examples: [
      { input: "nums = [2,2,1]", output: "1" },
      { input: "nums = [4,1,2,1,2]", output: "4" }
    ],
    constraints: ["1 ≤ nums.length ≤ 3 * 10⁴"],
    starterCode: {
      javascript: "function singleNumber(nums) {\n  // Write your solution here\n  \n}",
      python: "def singleNumber(nums):\n    # Write your solution here\n    pass",
      java: "class Solution {\n    public int singleNumber(int[] nums) {\n        // Write your solution here\n        return 0;\n    }\n}"
    },
    expectedOutput: { javascript: "1\n4", python: "1\n4", java: "1\n4" }
  },

  "missing-number": {
    id: "missing-number",
    title: "Missing Number",
    difficulty: "Easy",
    category: "Array • Bit Manipulation",
    description: {
      text: "Given an array nums containing n distinct numbers in the range [0, n], return the only number in the range that is missing from the array.",
      notes: []
    },
    examples: [
      { input: "nums = [3,0,1]", output: "2" },
      { input: "nums = [0,1]", output: "2" }
    ],
    constraints: ["n == nums.length", "1 ≤ n ≤ 10⁴"],
    starterCode: {
      javascript: "function missingNumber(nums) {\n  // Write your solution here\n  \n}",
      python: "def missingNumber(nums):\n    # Write your solution here\n    pass",
      java: "class Solution {\n    public int missingNumber(int[] nums) {\n        // Write your solution here\n        return 0;\n    }\n}"
    },
    expectedOutput: { javascript: "2\n2", python: "2\n2", java: "2\n2" }
  },

  "climbing-stairs": {
    id: "climbing-stairs",
    title: "Climbing Stairs",
    difficulty: "Easy",
    category: "Math • Dynamic Programming",
    description: {
      text: "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
      notes: []
    },
    examples: [
      { input: "n = 2", output: "2" },
      { input: "n = 3", output: "3" }
    ],
    constraints: ["1 ≤ n ≤ 45"],
    starterCode: {
      javascript: "function climbStairs(n) {\n  // Write your solution here\n  \n}",
      python: "def climbStairs(n):\n    # Write your solution here\n    pass",
      java: "class Solution {\n    public int climbStairs(int n) {\n        // Write your solution here\n        return 0;\n    }\n}"
    },
    expectedOutput: { javascript: "2\n3", python: "2\n3", java: "2\n3" }
  },

  "longest-substring-without-repeating-characters": {
    id: "longest-substring-without-repeating-characters",
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    category: "Hash Table • String • Sliding Window",
    description: {
      text: "Given a string s, find the length of the longest substring without repeating characters.",
      notes: []
    },
    examples: [
      { input: "s = 'abcabcbb'", output: "3" },
      { input: "s = 'bbbbb'", output: "1" }
    ],
    constraints: ["0 ≤ s.length ≤ 5 * 10⁴"],
    starterCode: {
      javascript: "function lengthOfLongestSubstring(s) {\n  // Write your solution here\n  \n}",
      python: "def lengthOfLongestSubstring(s):\n    # Write your solution here\n    pass",
      java: "class Solution {\n    public int lengthOfLongestSubstring(String s) {\n        // Write your solution here\n        return 0;\n    }\n}"
    },
    expectedOutput: { javascript: "3\n1", python: "3\n1", java: "3\n1" }
  },

  "3sum": {
    id: "3sum",
    title: "3Sum",
    difficulty: "Medium",
    category: "Array • Two Pointers",
    description: {
      text: "Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.",
      notes: ["Notice that the solution set must not contain duplicate triplets."]
    },
    examples: [
      { input: "nums = [-1,0,1,2,-1,-4]", output: "[[-1,-1,2],[-1,0,1]]" }
    ],
    constraints: ["3 ≤ nums.length ≤ 3000"],
    starterCode: {
      javascript: "function threeSum(nums) {\n  // Write your solution here\n  \n}",
      python: "def threeSum(nums):\n    # Write your solution here\n    pass",
      java: "class Solution {\n    public List<List<Integer>> threeSum(int[] nums) {\n        // Write your solution here\n        return new ArrayList<>();\n    }\n}"
    },
    expectedOutput: { javascript: "[[-1,-1,2],[-1,0,1]]", python: "[[-1,-1,2],[-1,0,1]]", java: "[[-1,-1,2],[-1,0,1]]" }
  },

  "group-anagrams": {
    id: "group-anagrams",
    title: "Group Anagrams",
    difficulty: "Medium",
    category: "Array • Hash Table • String",
    description: {
      text: "Given an array of strings strs, group the anagrams together. You can return the answer in any order.",
      notes: []
    },
    examples: [
      { input: "strs = [\"eat\",\"tea\",\"tan\",\"ate\",\"nat\",\"bat\"]", output: "[[\"bat\"],[\"nat\",\"tan\"],[\"ate\",\"eat\",\"tea\"]]" }
    ],
    constraints: ["1 ≤ strs.length ≤ 10⁴"],
    starterCode: {
      javascript: "function groupAnagrams(strs) {\n  // Write your solution here\n  \n}",
      python: "def groupAnagrams(strs):\n    # Write your solution here\n    pass",
      java: "class Solution {\n    public List<List<String>> groupAnagrams(String[] strs) {\n        // Write your solution here\n        return new ArrayList<>();\n    }\n}"
    },
    expectedOutput: { javascript: "[[\"bat\"],[\"nat\",\"tan\"],[\"ate\",\"eat\",\"tea\"]]", python: "[[\"bat\"],[\"nat\",\"tan\"],[\"ate\",\"eat\",\"tea\"]]", java: "[[\"bat\"],[\"nat\",\"tan\"],[\"ate\",\"eat\",\"tea\"]]" }
  },

  "product-of-array-except-self": {
    id: "product-of-array-except-self",
    title: "Product of Array Except Self",
    difficulty: "Medium",
    category: "Array • Prefix Sum",
    description: {
      text: "Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i].",
      notes: ["You must write an algorithm that runs in O(n) time and without using the division operation."]
    },
    examples: [
      { input: "nums = [1,2,3,4]", output: "[24,12,8,6]" }
    ],
    constraints: ["2 ≤ nums.length ≤ 10⁵"],
    starterCode: {
      javascript: "function productExceptSelf(nums) {\n  // Write your solution here\n  \n}",
      python: "def productExceptSelf(nums):\n    # Write your solution here\n    pass",
      java: "class Solution {\n    public int[] productExceptSelf(int[] nums) {\n        // Write your solution here\n        return new int[0];\n    }\n}"
    },
    expectedOutput: { javascript: "[24,12,8,6]", python: "[24,12,8,6]", java: "[24,12,8,6]" }
  },

  "word-search": {
    id: "word-search",
    title: "Word Search",
    difficulty: "Medium",
    category: "Array • Backtracking",
    description: {
      text: "Given an m x n grid of characters board and a string word, return true if word exists in the grid.",
      notes: []
    },
    examples: [
      { input: "board = [[\"A\",\"B\",\"C\",\"E\"],[\"S\",\"F\",\"C\",\"S\"],[\"A\",\"D\",\"E\",\"E\"]], word = \"ABCCED\"", output: "true" }
    ],
    constraints: ["1 ≤ m, n ≤ 6"],
    starterCode: {
      javascript: "function exist(board, word) {\n  // Write your solution here\n  \n}",
      python: "def exist(board, word):\n    # Write your solution here\n    pass",
      java: "class Solution {\n    public boolean exist(char[][] board, String word) {\n        // Write your solution here\n        return false;\n    }\n}"
    },
    expectedOutput: { javascript: "true", python: "True", java: "true" }
  },

  "merge-intervals": {
    id: "merge-intervals",
    title: "Merge Intervals",
    difficulty: "Medium",
    category: "Array • Sorting",
    description: {
      text: "Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.",
      notes: []
    },
    examples: [
      { input: "intervals = [[1,3],[2,6],[8,10],[15,18]]", output: "[[1,6],[8,10],[15,18]]" }
    ],
    constraints: ["1 ≤ intervals.length ≤ 10⁴"],
    starterCode: {
      javascript: "function merge(intervals) {\n  // Write your solution here\n  \n}",
      python: "def merge(intervals):\n    # Write your solution here\n    pass",
      java: "class Solution {\n    public int[][] merge(int[][] intervals) {\n        // Write your solution here\n        return new int[0][0];\n    }\n}"
    },
    expectedOutput: { javascript: "[[1,6],[8,10],[15,18]]", python: "[[1,6],[8,10],[15,18]]", java: "[[1,6],[8,10],[15,18]]" }
  },

  "kth-largest-element-in-an-array": {
    id: "kth-largest-element-in-an-array",
    title: "Kth Largest Element in an Array",
    difficulty: "Medium",
    category: "Array • Divide and Conquer",
    description: {
      text: "Given an integer array nums and an integer k, return the kth largest element in the array.",
      notes: ["Note that it is the kth largest element in the sorted order, not the kth distinct element."]
    },
    examples: [
      { input: "nums = [3,2,1,5,6,4], k = 2", output: "5" }
    ],
    constraints: ["1 ≤ k ≤ nums.length ≤ 10⁵"],
    starterCode: {
      javascript: "function findKthLargest(nums, k) {\n  // Write your solution here\n  \n}",
      python: "def findKthLargest(nums, k):\n    # Write your solution here\n    pass",
      java: "class Solution {\n    public int findKthLargest(int[] nums, int k) {\n        // Write your solution here\n        return 0;\n    }\n}"
    },
    expectedOutput: { javascript: "5", python: "5", java: "5" }
  },

  "coin-change": {
    id: "coin-change",
    title: "Coin Change",
    difficulty: "Medium",
    category: "Array • Dynamic Programming",
    description: {
      text: "You are given an integer array coins representing coins of different denominations and an integer amount representing a total amount of money.",
      notes: ["Return the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return -1."]
    },
    examples: [
      { input: "coins = [1,2,5], amount = 11", output: "3" }
    ],
    constraints: ["1 ≤ coins.length ≤ 12", "0 ≤ amount ≤ 10⁴"],
    starterCode: {
      javascript: "function coinChange(coins, amount) {\n  // Write your solution here\n  \n}",
      python: "def coinChange(coins, amount):\n    # Write your solution here\n    pass",
      java: "class Solution {\n    public int coinChange(int[] coins, int amount) {\n        // Write your solution here\n        return 0;\n    }\n}"
    },
    expectedOutput: { javascript: "3", python: "3", java: "3" }
  },

  "median-of-two-sorted-arrays": {
    id: "median-of-two-sorted-arrays",
    title: "Median of Two Sorted Arrays",
    difficulty: "Hard",
    category: "Array • Binary Search",
    description: {
      text: "Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.",
      notes: ["The overall run time complexity should be O(log (m+n))."]
    },
    examples: [
      { input: "nums1 = [1,3], nums2 = [2]", output: "2.00000" }
    ],
    constraints: ["0 ≤ m, n ≤ 1000"],
    starterCode: {
      javascript: "function findMedianSortedArrays(nums1, nums2) {\n  // Write your solution here\n  \n}",
      python: "def findMedianSortedArrays(nums1, nums2):\n    # Write your solution here\n    pass",
      java: "class Solution {\n    public double findMedianSortedArrays(int[] nums1, int[] nums2) {\n        // Write your solution here\n        return 0.0;\n    }\n}"
    },
    expectedOutput: { javascript: "2.00000", python: "2.00000", java: "2.00000" }
  },

  "trapping-rain-water": {
    id: "trapping-rain-water",
    title: "Trapping Rain Water",
    difficulty: "Hard",
    category: "Array • Two Pointers",
    description: {
      text: "Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.",
      notes: []
    },
    examples: [
      { input: "height = [0,1,0,2,1,0,1,3,2,1,2,1]", output: "6" }
    ],
    constraints: ["1 ≤ height.length ≤ 2 * 10⁴"],
    starterCode: {
      javascript: "function trap(height) {\n  // Write your solution here\n  \n}",
      python: "def trap(height):\n    # Write your solution here\n    pass",
      java: "class Solution {\n    public int trap(int[] height) {\n        // Write your solution here\n        return 0;\n    }\n}"
    },
    expectedOutput: { javascript: "6", python: "6", java: "6" }
  },

  "merge-k-sorted-lists": {
    id: "merge-k-sorted-lists",
    title: "Merge k Sorted Lists",
    difficulty: "Hard",
    category: "Linked List • Divide and Conquer",
    description: {
      text: "You are given an array of k linked-lists lists, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.",
      notes: []
    },
    examples: [
      { input: "lists = [[1,4,5],[1,3,4],[2,6]]", output: "[1,1,2,3,4,4,5,6]" }
    ],
    constraints: ["0 ≤ lists.length ≤ 10⁴"],
    starterCode: {
      javascript: "function mergeKLists(lists) {\n  // Write your solution here\n  \n}",
      python: "def mergeKLists(lists):\n    # Write your solution here\n    pass",
      java: "class Solution {\n    public ListNode mergeKLists(ListNode[] lists) {\n        // Write your solution here\n        return null;\n    }\n}"
    },
    expectedOutput: { javascript: "[1,1,2,3,4,4,5,6]", python: "[1,1,2,3,4,4,5,6]", java: "[1,1,2,3,4,4,5,6]" }
  },

  "regular-expression-matching": {
    id: "regular-expression-matching",
    title: "Regular Expression Matching",
    difficulty: "Hard",
    category: "String • Dynamic Programming",
    description: {
      text: "Given an input string s and a pattern p, implement regular expression matching with support for '.' and '*' where: '.' Matches any single character. '*' Matches zero or more of the preceding element.",
      notes: []
    },
    examples: [
      { input: "s = 'aa', p = 'a'", output: "false" },
      { input: "s = 'aa', p = 'a*'", output: "true" }
    ],
    constraints: ["1 ≤ s.length, p.length ≤ 20"],
    starterCode: {
      javascript: "function isMatch(s, p) {\n  // Write your solution here\n  \n}",
      python: "def isMatch(s, p):\n    # Write your solution here\n    pass",
      java: "class Solution {\n    public boolean isMatch(String s, String p) {\n        // Write your solution here\n        return false;\n    }\n}"
    },
    expectedOutput: { javascript: "false\ntrue", python: "False\nTrue", java: "false\ntrue" }
  },

  "longest-valid-parentheses": {
    id: "longest-valid-parentheses",
    title: "Longest Valid Parentheses",
    difficulty: "Hard",
    category: "String • Dynamic Programming",
    description: {
      text: "Given a string containing just the characters '(' and ')', return the length of the longest valid (well-formed) parentheses substring.",
      notes: []
    },
    examples: [
      { input: "s = '(()'", output: "2" },
      { input: "s = ')()())'", output: "4" }
    ],
    constraints: ["0 ≤ s.length ≤ 3 * 10⁴"],
    starterCode: {
      javascript: "function longestValidParentheses(s) {\n  // Write your solution here\n  \n}",
      python: "def longestValidParentheses(s):\n    # Write your solution here\n    pass",
      java: "class Solution {\n    public int longestValidParentheses(String s) {\n        // Write your solution here\n        return 0;\n    }\n}"
    },
    expectedOutput: { javascript: "2\n4", python: "2\n4", java: "2\n4" }
  },

  "edit-distance": {
    id: "edit-distance",
    title: "Edit Distance",
    difficulty: "Hard",
    category: "String • Dynamic Programming",
    description: {
      text: "Given two strings word1 and word2, return the minimum number of operations required to convert word1 to word2.",
      notes: ["You have the following three operations permitted on a word: Insert a character, Delete a character, Replace a character."]
    },
    examples: [
      { input: "word1 = 'horse', word2 = 'ros'", output: "3" }
    ],
    constraints: ["0 ≤ word1.length, word2.length ≤ 500"],
    starterCode: {
      javascript: "function minDistance(word1, word2) {\n  // Write your solution here\n  \n}",
      python: "def minDistance(word1, word2):\n    # Write your solution here\n    pass",
      java: "class Solution {\n    public int minDistance(String word1, String word2) {\n        // Write your solution here\n        return 0;\n    }\n}"
    },
    expectedOutput: { javascript: "3", python: "3", java: "3" }
  }
  ,  "problem-21": {
    id: "problem-21",
    title: "Algorithm Problem 21",
    difficulty: "Hard",
    category: "Array • Hash Table",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 21. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve21(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve21(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve21(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-22": {
    id: "problem-22",
    title: "Algorithm Problem 22",
    difficulty: "Hard",
    category: "Graph • BFS",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 22. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve22(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve22(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve22(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-23": {
    id: "problem-23",
    title: "Algorithm Problem 23",
    difficulty: "Hard",
    category: "Binary Search",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 23. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve23(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve23(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve23(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-24": {
    id: "problem-24",
    title: "Algorithm Problem 24",
    difficulty: "Easy",
    category: "Math",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 24. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve24(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve24(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve24(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-25": {
    id: "problem-25",
    title: "Algorithm Problem 25",
    difficulty: "Easy",
    category: "Math",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 25. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve25(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve25(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve25(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-26": {
    id: "problem-26",
    title: "Algorithm Problem 26",
    difficulty: "Easy",
    category: "Greedy",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 26. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve26(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve26(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve26(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-27": {
    id: "problem-27",
    title: "Algorithm Problem 27",
    difficulty: "Hard",
    category: "String • Two Pointers",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 27. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve27(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve27(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve27(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-28": {
    id: "problem-28",
    title: "Algorithm Problem 28",
    difficulty: "Easy",
    category: "Math",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 28. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve28(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve28(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve28(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-29": {
    id: "problem-29",
    title: "Algorithm Problem 29",
    difficulty: "Easy",
    category: "Graph • BFS",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 29. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve29(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve29(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve29(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-30": {
    id: "problem-30",
    title: "Algorithm Problem 30",
    difficulty: "Easy",
    category: "Linked List",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 30. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve30(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve30(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve30(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-31": {
    id: "problem-31",
    title: "Algorithm Problem 31",
    difficulty: "Medium",
    category: "Sliding Window",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 31. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve31(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve31(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve31(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-32": {
    id: "problem-32",
    title: "Algorithm Problem 32",
    difficulty: "Easy",
    category: "String • Two Pointers",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 32. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve32(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve32(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve32(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-33": {
    id: "problem-33",
    title: "Algorithm Problem 33",
    difficulty: "Medium",
    category: "String • Two Pointers",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 33. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve33(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve33(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve33(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-34": {
    id: "problem-34",
    title: "Algorithm Problem 34",
    difficulty: "Medium",
    category: "Linked List",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 34. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve34(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve34(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve34(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-35": {
    id: "problem-35",
    title: "Algorithm Problem 35",
    difficulty: "Medium",
    category: "Sliding Window",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 35. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve35(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve35(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve35(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-36": {
    id: "problem-36",
    title: "Algorithm Problem 36",
    difficulty: "Easy",
    category: "Array • Hash Table",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 36. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve36(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve36(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve36(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-37": {
    id: "problem-37",
    title: "Algorithm Problem 37",
    difficulty: "Medium",
    category: "String • Two Pointers",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 37. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve37(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve37(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve37(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-38": {
    id: "problem-38",
    title: "Algorithm Problem 38",
    difficulty: "Easy",
    category: "Greedy",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 38. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve38(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve38(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve38(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-39": {
    id: "problem-39",
    title: "Algorithm Problem 39",
    difficulty: "Hard",
    category: "Binary Search",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 39. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve39(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve39(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve39(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-40": {
    id: "problem-40",
    title: "Algorithm Problem 40",
    difficulty: "Medium",
    category: "Dynamic Programming",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 40. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve40(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve40(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve40(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-41": {
    id: "problem-41",
    title: "Algorithm Problem 41",
    difficulty: "Hard",
    category: "Dynamic Programming",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 41. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve41(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve41(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve41(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-42": {
    id: "problem-42",
    title: "Algorithm Problem 42",
    difficulty: "Medium",
    category: "Graph • BFS",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 42. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve42(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve42(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve42(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-43": {
    id: "problem-43",
    title: "Algorithm Problem 43",
    difficulty: "Medium",
    category: "Graph • BFS",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 43. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve43(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve43(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve43(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-44": {
    id: "problem-44",
    title: "Algorithm Problem 44",
    difficulty: "Hard",
    category: "Backtracking",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 44. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve44(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve44(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve44(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-45": {
    id: "problem-45",
    title: "Algorithm Problem 45",
    difficulty: "Hard",
    category: "Math",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 45. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve45(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve45(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve45(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-46": {
    id: "problem-46",
    title: "Algorithm Problem 46",
    difficulty: "Hard",
    category: "Binary Search",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 46. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve46(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve46(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve46(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-47": {
    id: "problem-47",
    title: "Algorithm Problem 47",
    difficulty: "Hard",
    category: "Bit Manipulation",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 47. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve47(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve47(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve47(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-48": {
    id: "problem-48",
    title: "Algorithm Problem 48",
    difficulty: "Medium",
    category: "Sliding Window",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 48. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve48(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve48(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve48(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-49": {
    id: "problem-49",
    title: "Algorithm Problem 49",
    difficulty: "Medium",
    category: "Backtracking",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 49. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve49(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve49(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve49(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-50": {
    id: "problem-50",
    title: "Algorithm Problem 50",
    difficulty: "Easy",
    category: "Binary Search",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 50. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve50(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve50(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve50(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-51": {
    id: "problem-51",
    title: "Algorithm Problem 51",
    difficulty: "Hard",
    category: "String • Two Pointers",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 51. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve51(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve51(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve51(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-52": {
    id: "problem-52",
    title: "Algorithm Problem 52",
    difficulty: "Easy",
    category: "Linked List",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 52. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve52(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve52(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve52(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-53": {
    id: "problem-53",
    title: "Algorithm Problem 53",
    difficulty: "Medium",
    category: "Linked List",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 53. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve53(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve53(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve53(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-54": {
    id: "problem-54",
    title: "Algorithm Problem 54",
    difficulty: "Hard",
    category: "Linked List",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 54. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve54(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve54(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve54(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-55": {
    id: "problem-55",
    title: "Algorithm Problem 55",
    difficulty: "Easy",
    category: "Math",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 55. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve55(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve55(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve55(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-56": {
    id: "problem-56",
    title: "Algorithm Problem 56",
    difficulty: "Medium",
    category: "Heap",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 56. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve56(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve56(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve56(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-57": {
    id: "problem-57",
    title: "Algorithm Problem 57",
    difficulty: "Easy",
    category: "Graph • BFS",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 57. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve57(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve57(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve57(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-58": {
    id: "problem-58",
    title: "Algorithm Problem 58",
    difficulty: "Medium",
    category: "Graph • BFS",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 58. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve58(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve58(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve58(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-59": {
    id: "problem-59",
    title: "Algorithm Problem 59",
    difficulty: "Medium",
    category: "Math",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 59. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve59(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve59(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve59(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-60": {
    id: "problem-60",
    title: "Algorithm Problem 60",
    difficulty: "Hard",
    category: "Binary Search",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 60. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve60(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve60(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve60(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-61": {
    id: "problem-61",
    title: "Algorithm Problem 61",
    difficulty: "Medium",
    category: "String • Two Pointers",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 61. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve61(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve61(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve61(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-62": {
    id: "problem-62",
    title: "Algorithm Problem 62",
    difficulty: "Hard",
    category: "String • Two Pointers",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 62. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve62(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve62(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve62(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-63": {
    id: "problem-63",
    title: "Algorithm Problem 63",
    difficulty: "Easy",
    category: "Greedy",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 63. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve63(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve63(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve63(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-64": {
    id: "problem-64",
    title: "Algorithm Problem 64",
    difficulty: "Easy",
    category: "Bit Manipulation",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 64. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve64(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve64(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve64(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-65": {
    id: "problem-65",
    title: "Algorithm Problem 65",
    difficulty: "Medium",
    category: "Graph • BFS",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 65. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve65(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve65(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve65(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-66": {
    id: "problem-66",
    title: "Algorithm Problem 66",
    difficulty: "Medium",
    category: "Dynamic Programming",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 66. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve66(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve66(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve66(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-67": {
    id: "problem-67",
    title: "Algorithm Problem 67",
    difficulty: "Hard",
    category: "Tree • DFS",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 67. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve67(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve67(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve67(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-68": {
    id: "problem-68",
    title: "Algorithm Problem 68",
    difficulty: "Hard",
    category: "Binary Search",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 68. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve68(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve68(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve68(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-69": {
    id: "problem-69",
    title: "Algorithm Problem 69",
    difficulty: "Medium",
    category: "Backtracking",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 69. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve69(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve69(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve69(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-70": {
    id: "problem-70",
    title: "Algorithm Problem 70",
    difficulty: "Easy",
    category: "String • Two Pointers",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 70. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve70(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve70(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve70(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-71": {
    id: "problem-71",
    title: "Algorithm Problem 71",
    difficulty: "Easy",
    category: "Backtracking",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 71. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve71(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve71(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve71(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-72": {
    id: "problem-72",
    title: "Algorithm Problem 72",
    difficulty: "Hard",
    category: "Graph • BFS",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 72. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve72(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve72(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve72(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-73": {
    id: "problem-73",
    title: "Algorithm Problem 73",
    difficulty: "Medium",
    category: "Backtracking",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 73. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve73(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve73(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve73(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-74": {
    id: "problem-74",
    title: "Algorithm Problem 74",
    difficulty: "Hard",
    category: "String • Two Pointers",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 74. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve74(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve74(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve74(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-75": {
    id: "problem-75",
    title: "Algorithm Problem 75",
    difficulty: "Hard",
    category: "Backtracking",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 75. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve75(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve75(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve75(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-76": {
    id: "problem-76",
    title: "Algorithm Problem 76",
    difficulty: "Medium",
    category: "Graph • BFS",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 76. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve76(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve76(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve76(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-77": {
    id: "problem-77",
    title: "Algorithm Problem 77",
    difficulty: "Hard",
    category: "Backtracking",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 77. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve77(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve77(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve77(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-78": {
    id: "problem-78",
    title: "Algorithm Problem 78",
    difficulty: "Easy",
    category: "Binary Search",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 78. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve78(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve78(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve78(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-79": {
    id: "problem-79",
    title: "Algorithm Problem 79",
    difficulty: "Medium",
    category: "String • Two Pointers",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 79. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve79(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve79(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve79(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-80": {
    id: "problem-80",
    title: "Algorithm Problem 80",
    difficulty: "Easy",
    category: "Array • Hash Table",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 80. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve80(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve80(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve80(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-81": {
    id: "problem-81",
    title: "Algorithm Problem 81",
    difficulty: "Hard",
    category: "Bit Manipulation",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 81. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve81(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve81(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve81(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-82": {
    id: "problem-82",
    title: "Algorithm Problem 82",
    difficulty: "Hard",
    category: "Binary Search",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 82. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve82(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve82(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve82(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-83": {
    id: "problem-83",
    title: "Algorithm Problem 83",
    difficulty: "Hard",
    category: "Tree • DFS",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 83. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve83(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve83(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve83(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-84": {
    id: "problem-84",
    title: "Algorithm Problem 84",
    difficulty: "Easy",
    category: "Dynamic Programming",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 84. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve84(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve84(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve84(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-85": {
    id: "problem-85",
    title: "Algorithm Problem 85",
    difficulty: "Easy",
    category: "Graph • BFS",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 85. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve85(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve85(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve85(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-86": {
    id: "problem-86",
    title: "Algorithm Problem 86",
    difficulty: "Medium",
    category: "Binary Search",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 86. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve86(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve86(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve86(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-87": {
    id: "problem-87",
    title: "Algorithm Problem 87",
    difficulty: "Hard",
    category: "Linked List",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 87. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve87(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve87(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve87(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-88": {
    id: "problem-88",
    title: "Algorithm Problem 88",
    difficulty: "Hard",
    category: "Tree • DFS",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 88. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve88(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve88(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve88(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-89": {
    id: "problem-89",
    title: "Algorithm Problem 89",
    difficulty: "Hard",
    category: "Sliding Window",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 89. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve89(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve89(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve89(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-90": {
    id: "problem-90",
    title: "Algorithm Problem 90",
    difficulty: "Medium",
    category: "Binary Search",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 90. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve90(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve90(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve90(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-91": {
    id: "problem-91",
    title: "Algorithm Problem 91",
    difficulty: "Medium",
    category: "Array • Hash Table",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 91. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve91(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve91(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve91(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-92": {
    id: "problem-92",
    title: "Algorithm Problem 92",
    difficulty: "Easy",
    category: "Graph • BFS",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 92. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve92(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve92(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve92(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-93": {
    id: "problem-93",
    title: "Algorithm Problem 93",
    difficulty: "Medium",
    category: "Math",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 93. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve93(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve93(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve93(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-94": {
    id: "problem-94",
    title: "Algorithm Problem 94",
    difficulty: "Easy",
    category: "Math",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 94. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve94(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve94(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve94(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-95": {
    id: "problem-95",
    title: "Algorithm Problem 95",
    difficulty: "Medium",
    category: "Tree • DFS",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 95. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve95(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve95(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve95(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-96": {
    id: "problem-96",
    title: "Algorithm Problem 96",
    difficulty: "Medium",
    category: "Tree • DFS",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 96. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve96(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve96(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve96(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-97": {
    id: "problem-97",
    title: "Algorithm Problem 97",
    difficulty: "Hard",
    category: "Backtracking",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 97. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve97(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve97(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve97(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-98": {
    id: "problem-98",
    title: "Algorithm Problem 98",
    difficulty: "Medium",
    category: "Backtracking",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 98. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve98(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve98(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve98(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-99": {
    id: "problem-99",
    title: "Algorithm Problem 99",
    difficulty: "Easy",
    category: "Tree • DFS",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 99. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve99(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve99(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve99(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-100": {
    id: "problem-100",
    title: "Algorithm Problem 100",
    difficulty: "Hard",
    category: "Backtracking",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 100. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve100(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve100(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve100(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-101": {
    id: "problem-101",
    title: "Algorithm Problem 101",
    difficulty: "Medium",
    category: "Bit Manipulation",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 101. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve101(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve101(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve101(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-102": {
    id: "problem-102",
    title: "Algorithm Problem 102",
    difficulty: "Hard",
    category: "Backtracking",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 102. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve102(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve102(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve102(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-103": {
    id: "problem-103",
    title: "Algorithm Problem 103",
    difficulty: "Medium",
    category: "Binary Search",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 103. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve103(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve103(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve103(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-104": {
    id: "problem-104",
    title: "Algorithm Problem 104",
    difficulty: "Hard",
    category: "Backtracking",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 104. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve104(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve104(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve104(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-105": {
    id: "problem-105",
    title: "Algorithm Problem 105",
    difficulty: "Medium",
    category: "Greedy",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 105. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve105(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve105(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve105(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-106": {
    id: "problem-106",
    title: "Algorithm Problem 106",
    difficulty: "Medium",
    category: "Linked List",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 106. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve106(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve106(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve106(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-107": {
    id: "problem-107",
    title: "Algorithm Problem 107",
    difficulty: "Medium",
    category: "Bit Manipulation",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 107. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve107(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve107(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve107(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-108": {
    id: "problem-108",
    title: "Algorithm Problem 108",
    difficulty: "Hard",
    category: "Tree • DFS",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 108. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve108(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve108(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve108(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-109": {
    id: "problem-109",
    title: "Algorithm Problem 109",
    difficulty: "Easy",
    category: "Tree • DFS",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 109. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve109(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve109(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve109(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-110": {
    id: "problem-110",
    title: "Algorithm Problem 110",
    difficulty: "Hard",
    category: "Graph • BFS",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 110. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve110(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve110(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve110(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-111": {
    id: "problem-111",
    title: "Algorithm Problem 111",
    difficulty: "Hard",
    category: "Array • Hash Table",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 111. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve111(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve111(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve111(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-112": {
    id: "problem-112",
    title: "Algorithm Problem 112",
    difficulty: "Medium",
    category: "Array • Hash Table",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 112. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve112(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve112(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve112(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-113": {
    id: "problem-113",
    title: "Algorithm Problem 113",
    difficulty: "Hard",
    category: "Linked List",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 113. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve113(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve113(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve113(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-114": {
    id: "problem-114",
    title: "Algorithm Problem 114",
    difficulty: "Hard",
    category: "Backtracking",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 114. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve114(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve114(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve114(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-115": {
    id: "problem-115",
    title: "Algorithm Problem 115",
    difficulty: "Easy",
    category: "Dynamic Programming",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 115. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve115(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve115(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve115(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-116": {
    id: "problem-116",
    title: "Algorithm Problem 116",
    difficulty: "Hard",
    category: "Graph • BFS",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 116. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve116(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve116(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve116(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-117": {
    id: "problem-117",
    title: "Algorithm Problem 117",
    difficulty: "Hard",
    category: "Sliding Window",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 117. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve117(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve117(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve117(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-118": {
    id: "problem-118",
    title: "Algorithm Problem 118",
    difficulty: "Hard",
    category: "Heap",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 118. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve118(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve118(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve118(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-119": {
    id: "problem-119",
    title: "Algorithm Problem 119",
    difficulty: "Medium",
    category: "Math",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 119. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve119(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve119(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve119(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-120": {
    id: "problem-120",
    title: "Algorithm Problem 120",
    difficulty: "Medium",
    category: "Greedy",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 120. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve120(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve120(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve120(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-121": {
    id: "problem-121",
    title: "Algorithm Problem 121",
    difficulty: "Medium",
    category: "Sliding Window",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 121. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve121(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve121(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve121(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-122": {
    id: "problem-122",
    title: "Algorithm Problem 122",
    difficulty: "Hard",
    category: "Graph • BFS",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 122. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve122(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve122(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve122(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-123": {
    id: "problem-123",
    title: "Algorithm Problem 123",
    difficulty: "Hard",
    category: "Dynamic Programming",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 123. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve123(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve123(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve123(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-124": {
    id: "problem-124",
    title: "Algorithm Problem 124",
    difficulty: "Easy",
    category: "Bit Manipulation",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 124. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve124(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve124(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve124(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-125": {
    id: "problem-125",
    title: "Algorithm Problem 125",
    difficulty: "Easy",
    category: "Dynamic Programming",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 125. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve125(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve125(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve125(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-126": {
    id: "problem-126",
    title: "Algorithm Problem 126",
    difficulty: "Hard",
    category: "Binary Search",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 126. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve126(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve126(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve126(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-127": {
    id: "problem-127",
    title: "Algorithm Problem 127",
    difficulty: "Medium",
    category: "Math",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 127. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve127(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve127(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve127(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-128": {
    id: "problem-128",
    title: "Algorithm Problem 128",
    difficulty: "Medium",
    category: "Math",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 128. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve128(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve128(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve128(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-129": {
    id: "problem-129",
    title: "Algorithm Problem 129",
    difficulty: "Medium",
    category: "Linked List",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 129. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve129(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve129(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve129(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-130": {
    id: "problem-130",
    title: "Algorithm Problem 130",
    difficulty: "Medium",
    category: "Sliding Window",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 130. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve130(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve130(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve130(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-131": {
    id: "problem-131",
    title: "Algorithm Problem 131",
    difficulty: "Hard",
    category: "Math",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 131. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve131(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve131(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve131(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-132": {
    id: "problem-132",
    title: "Algorithm Problem 132",
    difficulty: "Medium",
    category: "Linked List",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 132. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve132(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve132(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve132(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-133": {
    id: "problem-133",
    title: "Algorithm Problem 133",
    difficulty: "Medium",
    category: "Tree • DFS",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 133. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve133(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve133(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve133(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-134": {
    id: "problem-134",
    title: "Algorithm Problem 134",
    difficulty: "Hard",
    category: "Linked List",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 134. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve134(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve134(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve134(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-135": {
    id: "problem-135",
    title: "Algorithm Problem 135",
    difficulty: "Easy",
    category: "Math",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 135. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve135(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve135(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve135(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-136": {
    id: "problem-136",
    title: "Algorithm Problem 136",
    difficulty: "Easy",
    category: "Linked List",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 136. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve136(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve136(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve136(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-137": {
    id: "problem-137",
    title: "Algorithm Problem 137",
    difficulty: "Medium",
    category: "Backtracking",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 137. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve137(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve137(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve137(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-138": {
    id: "problem-138",
    title: "Algorithm Problem 138",
    difficulty: "Medium",
    category: "Array • Hash Table",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 138. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve138(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve138(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve138(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-139": {
    id: "problem-139",
    title: "Algorithm Problem 139",
    difficulty: "Medium",
    category: "Graph • BFS",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 139. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve139(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve139(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve139(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-140": {
    id: "problem-140",
    title: "Algorithm Problem 140",
    difficulty: "Hard",
    category: "String • Two Pointers",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 140. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve140(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve140(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve140(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-141": {
    id: "problem-141",
    title: "Algorithm Problem 141",
    difficulty: "Hard",
    category: "Bit Manipulation",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 141. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve141(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve141(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve141(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-142": {
    id: "problem-142",
    title: "Algorithm Problem 142",
    difficulty: "Hard",
    category: "Tree • DFS",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 142. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve142(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve142(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve142(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-143": {
    id: "problem-143",
    title: "Algorithm Problem 143",
    difficulty: "Easy",
    category: "Tree • DFS",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 143. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve143(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve143(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve143(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-144": {
    id: "problem-144",
    title: "Algorithm Problem 144",
    difficulty: "Easy",
    category: "Binary Search",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 144. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve144(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve144(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve144(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-145": {
    id: "problem-145",
    title: "Algorithm Problem 145",
    difficulty: "Hard",
    category: "Math",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 145. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve145(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve145(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve145(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-146": {
    id: "problem-146",
    title: "Algorithm Problem 146",
    difficulty: "Hard",
    category: "Graph • BFS",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 146. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve146(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve146(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve146(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-147": {
    id: "problem-147",
    title: "Algorithm Problem 147",
    difficulty: "Hard",
    category: "Tree • DFS",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 147. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve147(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve147(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve147(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-148": {
    id: "problem-148",
    title: "Algorithm Problem 148",
    difficulty: "Hard",
    category: "Heap",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 148. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve148(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve148(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve148(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-149": {
    id: "problem-149",
    title: "Algorithm Problem 149",
    difficulty: "Easy",
    category: "Math",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 149. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve149(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve149(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve149(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-150": {
    id: "problem-150",
    title: "Algorithm Problem 150",
    difficulty: "Easy",
    category: "Sliding Window",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 150. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve150(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve150(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve150(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-151": {
    id: "problem-151",
    title: "Algorithm Problem 151",
    difficulty: "Easy",
    category: "Binary Search",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 151. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve151(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve151(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve151(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-152": {
    id: "problem-152",
    title: "Algorithm Problem 152",
    difficulty: "Medium",
    category: "Math",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 152. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve152(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve152(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve152(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-153": {
    id: "problem-153",
    title: "Algorithm Problem 153",
    difficulty: "Medium",
    category: "Heap",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 153. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve153(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve153(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve153(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-154": {
    id: "problem-154",
    title: "Algorithm Problem 154",
    difficulty: "Easy",
    category: "Graph • BFS",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 154. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve154(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve154(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve154(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-155": {
    id: "problem-155",
    title: "Algorithm Problem 155",
    difficulty: "Hard",
    category: "Heap",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 155. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve155(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve155(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve155(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-156": {
    id: "problem-156",
    title: "Algorithm Problem 156",
    difficulty: "Easy",
    category: "Backtracking",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 156. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve156(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve156(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve156(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-157": {
    id: "problem-157",
    title: "Algorithm Problem 157",
    difficulty: "Hard",
    category: "Bit Manipulation",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 157. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve157(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve157(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve157(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-158": {
    id: "problem-158",
    title: "Algorithm Problem 158",
    difficulty: "Easy",
    category: "Linked List",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 158. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve158(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve158(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve158(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-159": {
    id: "problem-159",
    title: "Algorithm Problem 159",
    difficulty: "Easy",
    category: "Backtracking",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 159. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve159(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve159(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve159(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-160": {
    id: "problem-160",
    title: "Algorithm Problem 160",
    difficulty: "Hard",
    category: "Math",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 160. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve160(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve160(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve160(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-161": {
    id: "problem-161",
    title: "Algorithm Problem 161",
    difficulty: "Easy",
    category: "Tree • DFS",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 161. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve161(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve161(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve161(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-162": {
    id: "problem-162",
    title: "Algorithm Problem 162",
    difficulty: "Easy",
    category: "String • Two Pointers",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 162. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve162(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve162(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve162(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-163": {
    id: "problem-163",
    title: "Algorithm Problem 163",
    difficulty: "Easy",
    category: "Heap",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 163. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve163(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve163(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve163(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-164": {
    id: "problem-164",
    title: "Algorithm Problem 164",
    difficulty: "Medium",
    category: "Tree • DFS",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 164. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve164(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve164(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve164(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-165": {
    id: "problem-165",
    title: "Algorithm Problem 165",
    difficulty: "Medium",
    category: "Linked List",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 165. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve165(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve165(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve165(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-166": {
    id: "problem-166",
    title: "Algorithm Problem 166",
    difficulty: "Hard",
    category: "Tree • DFS",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 166. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve166(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve166(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve166(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-167": {
    id: "problem-167",
    title: "Algorithm Problem 167",
    difficulty: "Easy",
    category: "Math",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 167. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve167(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve167(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve167(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-168": {
    id: "problem-168",
    title: "Algorithm Problem 168",
    difficulty: "Easy",
    category: "Tree • DFS",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 168. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve168(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve168(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve168(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-169": {
    id: "problem-169",
    title: "Algorithm Problem 169",
    difficulty: "Hard",
    category: "Linked List",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 169. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve169(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve169(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve169(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-170": {
    id: "problem-170",
    title: "Algorithm Problem 170",
    difficulty: "Easy",
    category: "Linked List",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 170. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve170(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve170(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve170(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-171": {
    id: "problem-171",
    title: "Algorithm Problem 171",
    difficulty: "Medium",
    category: "String • Two Pointers",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 171. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve171(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve171(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve171(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-172": {
    id: "problem-172",
    title: "Algorithm Problem 172",
    difficulty: "Hard",
    category: "Graph • BFS",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 172. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve172(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve172(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve172(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-173": {
    id: "problem-173",
    title: "Algorithm Problem 173",
    difficulty: "Easy",
    category: "Array • Hash Table",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 173. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve173(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve173(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve173(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-174": {
    id: "problem-174",
    title: "Algorithm Problem 174",
    difficulty: "Medium",
    category: "Sliding Window",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 174. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve174(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve174(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve174(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-175": {
    id: "problem-175",
    title: "Algorithm Problem 175",
    difficulty: "Hard",
    category: "Tree • DFS",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 175. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve175(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve175(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve175(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-176": {
    id: "problem-176",
    title: "Algorithm Problem 176",
    difficulty: "Medium",
    category: "Math",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 176. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve176(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve176(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve176(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-177": {
    id: "problem-177",
    title: "Algorithm Problem 177",
    difficulty: "Easy",
    category: "Sliding Window",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 177. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve177(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve177(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve177(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-178": {
    id: "problem-178",
    title: "Algorithm Problem 178",
    difficulty: "Hard",
    category: "Heap",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 178. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve178(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve178(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve178(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-179": {
    id: "problem-179",
    title: "Algorithm Problem 179",
    difficulty: "Easy",
    category: "Bit Manipulation",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 179. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve179(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve179(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve179(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-180": {
    id: "problem-180",
    title: "Algorithm Problem 180",
    difficulty: "Easy",
    category: "Tree • DFS",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 180. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve180(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve180(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve180(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-181": {
    id: "problem-181",
    title: "Algorithm Problem 181",
    difficulty: "Medium",
    category: "Binary Search",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 181. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve181(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve181(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve181(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-182": {
    id: "problem-182",
    title: "Algorithm Problem 182",
    difficulty: "Easy",
    category: "Backtracking",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 182. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve182(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve182(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve182(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-183": {
    id: "problem-183",
    title: "Algorithm Problem 183",
    difficulty: "Medium",
    category: "Tree • DFS",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 183. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve183(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve183(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve183(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-184": {
    id: "problem-184",
    title: "Algorithm Problem 184",
    difficulty: "Hard",
    category: "Binary Search",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 184. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve184(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve184(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve184(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-185": {
    id: "problem-185",
    title: "Algorithm Problem 185",
    difficulty: "Easy",
    category: "Binary Search",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 185. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve185(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve185(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve185(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-186": {
    id: "problem-186",
    title: "Algorithm Problem 186",
    difficulty: "Easy",
    category: "Linked List",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 186. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve186(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve186(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve186(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-187": {
    id: "problem-187",
    title: "Algorithm Problem 187",
    difficulty: "Hard",
    category: "Heap",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 187. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve187(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve187(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve187(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-188": {
    id: "problem-188",
    title: "Algorithm Problem 188",
    difficulty: "Medium",
    category: "Tree • DFS",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 188. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve188(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve188(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve188(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-189": {
    id: "problem-189",
    title: "Algorithm Problem 189",
    difficulty: "Medium",
    category: "String • Two Pointers",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 189. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve189(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve189(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve189(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-190": {
    id: "problem-190",
    title: "Algorithm Problem 190",
    difficulty: "Hard",
    category: "String • Two Pointers",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 190. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve190(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve190(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve190(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-191": {
    id: "problem-191",
    title: "Algorithm Problem 191",
    difficulty: "Easy",
    category: "String • Two Pointers",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 191. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve191(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve191(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve191(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-192": {
    id: "problem-192",
    title: "Algorithm Problem 192",
    difficulty: "Hard",
    category: "Backtracking",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 192. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve192(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve192(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve192(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-193": {
    id: "problem-193",
    title: "Algorithm Problem 193",
    difficulty: "Easy",
    category: "Backtracking",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 193. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve193(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve193(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve193(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-194": {
    id: "problem-194",
    title: "Algorithm Problem 194",
    difficulty: "Easy",
    category: "Binary Search",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 194. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve194(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve194(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve194(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-195": {
    id: "problem-195",
    title: "Algorithm Problem 195",
    difficulty: "Hard",
    category: "Math",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 195. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve195(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve195(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve195(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-196": {
    id: "problem-196",
    title: "Algorithm Problem 196",
    difficulty: "Medium",
    category: "Linked List",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 196. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve196(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve196(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve196(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-197": {
    id: "problem-197",
    title: "Algorithm Problem 197",
    difficulty: "Hard",
    category: "Dynamic Programming",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 197. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve197(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve197(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve197(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-198": {
    id: "problem-198",
    title: "Algorithm Problem 198",
    difficulty: "Easy",
    category: "Binary Search",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 198. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve198(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve198(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve198(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-199": {
    id: "problem-199",
    title: "Algorithm Problem 199",
    difficulty: "Easy",
    category: "String • Two Pointers",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 199. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve199(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve199(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve199(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-200": {
    id: "problem-200",
    title: "Algorithm Problem 200",
    difficulty: "Hard",
    category: "Math",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 200. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve200(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve200(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve200(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-201": {
    id: "problem-201",
    title: "Algorithm Problem 201",
    difficulty: "Hard",
    category: "Array • Hash Table",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 201. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve201(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve201(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve201(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-202": {
    id: "problem-202",
    title: "Algorithm Problem 202",
    difficulty: "Medium",
    category: "Graph • BFS",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 202. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve202(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve202(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve202(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-203": {
    id: "problem-203",
    title: "Algorithm Problem 203",
    difficulty: "Medium",
    category: "Math",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 203. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve203(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve203(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve203(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-204": {
    id: "problem-204",
    title: "Algorithm Problem 204",
    difficulty: "Hard",
    category: "Bit Manipulation",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 204. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve204(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve204(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve204(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-205": {
    id: "problem-205",
    title: "Algorithm Problem 205",
    difficulty: "Hard",
    category: "Sliding Window",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 205. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve205(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve205(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve205(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-206": {
    id: "problem-206",
    title: "Algorithm Problem 206",
    difficulty: "Medium",
    category: "Bit Manipulation",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 206. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve206(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve206(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve206(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-207": {
    id: "problem-207",
    title: "Algorithm Problem 207",
    difficulty: "Hard",
    category: "Math",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 207. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve207(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve207(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve207(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-208": {
    id: "problem-208",
    title: "Algorithm Problem 208",
    difficulty: "Medium",
    category: "Array • Hash Table",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 208. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve208(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve208(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve208(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-209": {
    id: "problem-209",
    title: "Algorithm Problem 209",
    difficulty: "Hard",
    category: "String • Two Pointers",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 209. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve209(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve209(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve209(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-210": {
    id: "problem-210",
    title: "Algorithm Problem 210",
    difficulty: "Easy",
    category: "Tree • DFS",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 210. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve210(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve210(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve210(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-211": {
    id: "problem-211",
    title: "Algorithm Problem 211",
    difficulty: "Hard",
    category: "Greedy",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 211. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve211(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve211(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve211(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-212": {
    id: "problem-212",
    title: "Algorithm Problem 212",
    difficulty: "Easy",
    category: "Math",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 212. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve212(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve212(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve212(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-213": {
    id: "problem-213",
    title: "Algorithm Problem 213",
    difficulty: "Easy",
    category: "Graph • BFS",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 213. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve213(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve213(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve213(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-214": {
    id: "problem-214",
    title: "Algorithm Problem 214",
    difficulty: "Easy",
    category: "Sliding Window",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 214. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve214(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve214(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve214(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-215": {
    id: "problem-215",
    title: "Algorithm Problem 215",
    difficulty: "Medium",
    category: "Graph • BFS",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 215. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve215(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve215(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve215(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-216": {
    id: "problem-216",
    title: "Algorithm Problem 216",
    difficulty: "Hard",
    category: "Binary Search",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 216. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve216(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve216(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve216(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-217": {
    id: "problem-217",
    title: "Algorithm Problem 217",
    difficulty: "Medium",
    category: "Heap",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 217. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve217(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve217(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve217(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-218": {
    id: "problem-218",
    title: "Algorithm Problem 218",
    difficulty: "Easy",
    category: "Binary Search",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 218. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve218(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve218(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve218(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-219": {
    id: "problem-219",
    title: "Algorithm Problem 219",
    difficulty: "Easy",
    category: "Backtracking",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 219. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve219(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve219(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve219(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-220": {
    id: "problem-220",
    title: "Algorithm Problem 220",
    difficulty: "Medium",
    category: "Graph • BFS",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 220. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve220(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve220(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve220(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-221": {
    id: "problem-221",
    title: "Algorithm Problem 221",
    difficulty: "Medium",
    category: "Sliding Window",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 221. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve221(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve221(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve221(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-222": {
    id: "problem-222",
    title: "Algorithm Problem 222",
    difficulty: "Medium",
    category: "Graph • BFS",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 222. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve222(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve222(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve222(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-223": {
    id: "problem-223",
    title: "Algorithm Problem 223",
    difficulty: "Hard",
    category: "Math",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 223. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve223(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve223(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve223(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-224": {
    id: "problem-224",
    title: "Algorithm Problem 224",
    difficulty: "Easy",
    category: "Heap",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 224. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve224(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve224(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve224(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-225": {
    id: "problem-225",
    title: "Algorithm Problem 225",
    difficulty: "Easy",
    category: "String • Two Pointers",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 225. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve225(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve225(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve225(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-226": {
    id: "problem-226",
    title: "Algorithm Problem 226",
    difficulty: "Easy",
    category: "Array • Hash Table",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 226. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve226(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve226(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve226(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-227": {
    id: "problem-227",
    title: "Algorithm Problem 227",
    difficulty: "Medium",
    category: "Dynamic Programming",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 227. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve227(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve227(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve227(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-228": {
    id: "problem-228",
    title: "Algorithm Problem 228",
    difficulty: "Easy",
    category: "Backtracking",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 228. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve228(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve228(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve228(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-229": {
    id: "problem-229",
    title: "Algorithm Problem 229",
    difficulty: "Hard",
    category: "Math",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 229. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve229(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve229(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve229(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-230": {
    id: "problem-230",
    title: "Algorithm Problem 230",
    difficulty: "Hard",
    category: "Sliding Window",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 230. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve230(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve230(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve230(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-231": {
    id: "problem-231",
    title: "Algorithm Problem 231",
    difficulty: "Hard",
    category: "Array • Hash Table",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 231. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve231(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve231(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve231(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-232": {
    id: "problem-232",
    title: "Algorithm Problem 232",
    difficulty: "Medium",
    category: "Dynamic Programming",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 232. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve232(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve232(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve232(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-233": {
    id: "problem-233",
    title: "Algorithm Problem 233",
    difficulty: "Medium",
    category: "String • Two Pointers",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 233. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve233(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve233(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve233(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-234": {
    id: "problem-234",
    title: "Algorithm Problem 234",
    difficulty: "Medium",
    category: "Greedy",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 234. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve234(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve234(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve234(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-235": {
    id: "problem-235",
    title: "Algorithm Problem 235",
    difficulty: "Medium",
    category: "Dynamic Programming",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 235. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve235(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve235(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve235(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-236": {
    id: "problem-236",
    title: "Algorithm Problem 236",
    difficulty: "Medium",
    category: "Backtracking",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 236. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve236(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve236(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve236(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-237": {
    id: "problem-237",
    title: "Algorithm Problem 237",
    difficulty: "Hard",
    category: "Linked List",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 237. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve237(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve237(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve237(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-238": {
    id: "problem-238",
    title: "Algorithm Problem 238",
    difficulty: "Hard",
    category: "Array • Hash Table",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 238. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve238(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve238(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve238(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-239": {
    id: "problem-239",
    title: "Algorithm Problem 239",
    difficulty: "Hard",
    category: "Dynamic Programming",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 239. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve239(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve239(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve239(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-240": {
    id: "problem-240",
    title: "Algorithm Problem 240",
    difficulty: "Medium",
    category: "String • Two Pointers",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 240. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve240(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve240(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve240(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-241": {
    id: "problem-241",
    title: "Algorithm Problem 241",
    difficulty: "Hard",
    category: "Sliding Window",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 241. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve241(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve241(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve241(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-242": {
    id: "problem-242",
    title: "Algorithm Problem 242",
    difficulty: "Easy",
    category: "Array • Hash Table",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 242. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve242(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve242(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve242(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-243": {
    id: "problem-243",
    title: "Algorithm Problem 243",
    difficulty: "Easy",
    category: "Heap",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 243. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve243(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve243(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve243(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-244": {
    id: "problem-244",
    title: "Algorithm Problem 244",
    difficulty: "Hard",
    category: "Graph • BFS",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 244. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve244(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve244(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve244(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-245": {
    id: "problem-245",
    title: "Algorithm Problem 245",
    difficulty: "Hard",
    category: "Greedy",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 245. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve245(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve245(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve245(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-246": {
    id: "problem-246",
    title: "Algorithm Problem 246",
    difficulty: "Medium",
    category: "Sliding Window",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 246. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve246(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve246(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve246(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-247": {
    id: "problem-247",
    title: "Algorithm Problem 247",
    difficulty: "Hard",
    category: "Linked List",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 247. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve247(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve247(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve247(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-248": {
    id: "problem-248",
    title: "Algorithm Problem 248",
    difficulty: "Medium",
    category: "Greedy",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 248. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve248(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve248(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve248(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-249": {
    id: "problem-249",
    title: "Algorithm Problem 249",
    difficulty: "Easy",
    category: "Math",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 249. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve249(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve249(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve249(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-250": {
    id: "problem-250",
    title: "Algorithm Problem 250",
    difficulty: "Easy",
    category: "Backtracking",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 250. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve250(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve250(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve250(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-251": {
    id: "problem-251",
    title: "Algorithm Problem 251",
    difficulty: "Hard",
    category: "Bit Manipulation",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 251. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve251(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve251(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve251(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-252": {
    id: "problem-252",
    title: "Algorithm Problem 252",
    difficulty: "Hard",
    category: "Dynamic Programming",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 252. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve252(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve252(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve252(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-253": {
    id: "problem-253",
    title: "Algorithm Problem 253",
    difficulty: "Medium",
    category: "Backtracking",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 253. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve253(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve253(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve253(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-254": {
    id: "problem-254",
    title: "Algorithm Problem 254",
    difficulty: "Easy",
    category: "Backtracking",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 254. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve254(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve254(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve254(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-255": {
    id: "problem-255",
    title: "Algorithm Problem 255",
    difficulty: "Medium",
    category: "Binary Search",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 255. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve255(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve255(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve255(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-256": {
    id: "problem-256",
    title: "Algorithm Problem 256",
    difficulty: "Easy",
    category: "Binary Search",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 256. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve256(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve256(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve256(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-257": {
    id: "problem-257",
    title: "Algorithm Problem 257",
    difficulty: "Hard",
    category: "Bit Manipulation",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 257. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve257(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve257(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve257(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-258": {
    id: "problem-258",
    title: "Algorithm Problem 258",
    difficulty: "Hard",
    category: "Binary Search",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 258. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve258(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve258(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve258(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-259": {
    id: "problem-259",
    title: "Algorithm Problem 259",
    difficulty: "Easy",
    category: "Math",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 259. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve259(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve259(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve259(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-260": {
    id: "problem-260",
    title: "Algorithm Problem 260",
    difficulty: "Easy",
    category: "Heap",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 260. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve260(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve260(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve260(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-261": {
    id: "problem-261",
    title: "Algorithm Problem 261",
    difficulty: "Easy",
    category: "Math",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 261. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve261(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve261(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve261(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-262": {
    id: "problem-262",
    title: "Algorithm Problem 262",
    difficulty: "Easy",
    category: "Greedy",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 262. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve262(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve262(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve262(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-263": {
    id: "problem-263",
    title: "Algorithm Problem 263",
    difficulty: "Hard",
    category: "Tree • DFS",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 263. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve263(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve263(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve263(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-264": {
    id: "problem-264",
    title: "Algorithm Problem 264",
    difficulty: "Medium",
    category: "Bit Manipulation",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 264. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve264(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve264(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve264(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-265": {
    id: "problem-265",
    title: "Algorithm Problem 265",
    difficulty: "Hard",
    category: "String • Two Pointers",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 265. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve265(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve265(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve265(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-266": {
    id: "problem-266",
    title: "Algorithm Problem 266",
    difficulty: "Medium",
    category: "String • Two Pointers",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 266. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve266(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve266(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve266(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-267": {
    id: "problem-267",
    title: "Algorithm Problem 267",
    difficulty: "Easy",
    category: "Tree • DFS",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 267. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve267(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve267(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve267(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-268": {
    id: "problem-268",
    title: "Algorithm Problem 268",
    difficulty: "Easy",
    category: "Greedy",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 268. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve268(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve268(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve268(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-269": {
    id: "problem-269",
    title: "Algorithm Problem 269",
    difficulty: "Medium",
    category: "String • Two Pointers",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 269. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve269(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve269(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve269(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-270": {
    id: "problem-270",
    title: "Algorithm Problem 270",
    difficulty: "Easy",
    category: "Array • Hash Table",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 270. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve270(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve270(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve270(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-271": {
    id: "problem-271",
    title: "Algorithm Problem 271",
    difficulty: "Hard",
    category: "Math",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 271. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve271(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve271(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve271(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-272": {
    id: "problem-272",
    title: "Algorithm Problem 272",
    difficulty: "Hard",
    category: "String • Two Pointers",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 272. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve272(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve272(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve272(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-273": {
    id: "problem-273",
    title: "Algorithm Problem 273",
    difficulty: "Easy",
    category: "Linked List",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 273. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve273(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve273(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve273(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-274": {
    id: "problem-274",
    title: "Algorithm Problem 274",
    difficulty: "Medium",
    category: "Binary Search",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 274. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve274(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve274(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve274(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-275": {
    id: "problem-275",
    title: "Algorithm Problem 275",
    difficulty: "Easy",
    category: "Backtracking",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 275. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve275(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve275(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve275(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-276": {
    id: "problem-276",
    title: "Algorithm Problem 276",
    difficulty: "Medium",
    category: "Math",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 276. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve276(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve276(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve276(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-277": {
    id: "problem-277",
    title: "Algorithm Problem 277",
    difficulty: "Medium",
    category: "Heap",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 277. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve277(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve277(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve277(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-278": {
    id: "problem-278",
    title: "Algorithm Problem 278",
    difficulty: "Hard",
    category: "Heap",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 278. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve278(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve278(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve278(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-279": {
    id: "problem-279",
    title: "Algorithm Problem 279",
    difficulty: "Medium",
    category: "Backtracking",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 279. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve279(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve279(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve279(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-280": {
    id: "problem-280",
    title: "Algorithm Problem 280",
    difficulty: "Medium",
    category: "Backtracking",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 280. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve280(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve280(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve280(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-281": {
    id: "problem-281",
    title: "Algorithm Problem 281",
    difficulty: "Medium",
    category: "Sliding Window",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 281. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve281(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve281(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve281(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-282": {
    id: "problem-282",
    title: "Algorithm Problem 282",
    difficulty: "Medium",
    category: "Linked List",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 282. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve282(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve282(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve282(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-283": {
    id: "problem-283",
    title: "Algorithm Problem 283",
    difficulty: "Easy",
    category: "Dynamic Programming",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 283. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve283(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve283(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve283(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-284": {
    id: "problem-284",
    title: "Algorithm Problem 284",
    difficulty: "Medium",
    category: "Dynamic Programming",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 284. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve284(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve284(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve284(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-285": {
    id: "problem-285",
    title: "Algorithm Problem 285",
    difficulty: "Medium",
    category: "Tree • DFS",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 285. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve285(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve285(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve285(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-286": {
    id: "problem-286",
    title: "Algorithm Problem 286",
    difficulty: "Medium",
    category: "String • Two Pointers",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 286. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve286(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve286(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve286(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-287": {
    id: "problem-287",
    title: "Algorithm Problem 287",
    difficulty: "Medium",
    category: "Binary Search",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 287. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve287(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve287(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve287(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-288": {
    id: "problem-288",
    title: "Algorithm Problem 288",
    difficulty: "Medium",
    category: "Dynamic Programming",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 288. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve288(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve288(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve288(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-289": {
    id: "problem-289",
    title: "Algorithm Problem 289",
    difficulty: "Hard",
    category: "Backtracking",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 289. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve289(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve289(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve289(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-290": {
    id: "problem-290",
    title: "Algorithm Problem 290",
    difficulty: "Medium",
    category: "Math",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 290. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve290(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve290(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve290(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-291": {
    id: "problem-291",
    title: "Algorithm Problem 291",
    difficulty: "Medium",
    category: "Heap",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 291. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve291(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve291(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve291(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-292": {
    id: "problem-292",
    title: "Algorithm Problem 292",
    difficulty: "Medium",
    category: "String • Two Pointers",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 292. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve292(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve292(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve292(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-293": {
    id: "problem-293",
    title: "Algorithm Problem 293",
    difficulty: "Medium",
    category: "Graph • BFS",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 293. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve293(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve293(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve293(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-294": {
    id: "problem-294",
    title: "Algorithm Problem 294",
    difficulty: "Hard",
    category: "Tree • DFS",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 294. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve294(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve294(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve294(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-295": {
    id: "problem-295",
    title: "Algorithm Problem 295",
    difficulty: "Easy",
    category: "Dynamic Programming",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 295. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve295(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve295(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve295(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-296": {
    id: "problem-296",
    title: "Algorithm Problem 296",
    difficulty: "Medium",
    category: "String • Two Pointers",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 296. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve296(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve296(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve296(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-297": {
    id: "problem-297",
    title: "Algorithm Problem 297",
    difficulty: "Hard",
    category: "Backtracking",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 297. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve297(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve297(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve297(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-298": {
    id: "problem-298",
    title: "Algorithm Problem 298",
    difficulty: "Medium",
    category: "Dynamic Programming",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 298. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve298(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve298(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve298(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-299": {
    id: "problem-299",
    title: "Algorithm Problem 299",
    difficulty: "Easy",
    category: "Backtracking",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 299. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve299(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve299(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve299(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-300": {
    id: "problem-300",
    title: "Algorithm Problem 300",
    difficulty: "Hard",
    category: "Sliding Window",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 300. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve300(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve300(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve300(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-301": {
    id: "problem-301",
    title: "Algorithm Problem 301",
    difficulty: "Easy",
    category: "Sliding Window",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 301. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve301(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve301(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve301(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-302": {
    id: "problem-302",
    title: "Algorithm Problem 302",
    difficulty: "Easy",
    category: "Binary Search",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 302. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve302(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve302(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve302(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-303": {
    id: "problem-303",
    title: "Algorithm Problem 303",
    difficulty: "Hard",
    category: "Heap",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 303. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve303(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve303(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve303(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-304": {
    id: "problem-304",
    title: "Algorithm Problem 304",
    difficulty: "Medium",
    category: "Graph • BFS",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 304. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve304(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve304(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve304(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-305": {
    id: "problem-305",
    title: "Algorithm Problem 305",
    difficulty: "Easy",
    category: "Array • Hash Table",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 305. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve305(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve305(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve305(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-306": {
    id: "problem-306",
    title: "Algorithm Problem 306",
    difficulty: "Medium",
    category: "Binary Search",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 306. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve306(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve306(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve306(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-307": {
    id: "problem-307",
    title: "Algorithm Problem 307",
    difficulty: "Hard",
    category: "Backtracking",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 307. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve307(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve307(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve307(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-308": {
    id: "problem-308",
    title: "Algorithm Problem 308",
    difficulty: "Medium",
    category: "Backtracking",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 308. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve308(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve308(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve308(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-309": {
    id: "problem-309",
    title: "Algorithm Problem 309",
    difficulty: "Medium",
    category: "Backtracking",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 309. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve309(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve309(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve309(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-310": {
    id: "problem-310",
    title: "Algorithm Problem 310",
    difficulty: "Easy",
    category: "Tree • DFS",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 310. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve310(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve310(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve310(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-311": {
    id: "problem-311",
    title: "Algorithm Problem 311",
    difficulty: "Hard",
    category: "Bit Manipulation",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 311. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve311(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve311(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve311(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-312": {
    id: "problem-312",
    title: "Algorithm Problem 312",
    difficulty: "Easy",
    category: "Heap",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 312. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve312(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve312(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve312(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-313": {
    id: "problem-313",
    title: "Algorithm Problem 313",
    difficulty: "Easy",
    category: "Dynamic Programming",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 313. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve313(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve313(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve313(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-314": {
    id: "problem-314",
    title: "Algorithm Problem 314",
    difficulty: "Hard",
    category: "Dynamic Programming",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 314. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve314(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve314(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve314(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-315": {
    id: "problem-315",
    title: "Algorithm Problem 315",
    difficulty: "Easy",
    category: "Greedy",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 315. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve315(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve315(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve315(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-316": {
    id: "problem-316",
    title: "Algorithm Problem 316",
    difficulty: "Hard",
    category: "Array • Hash Table",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 316. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve316(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve316(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve316(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-317": {
    id: "problem-317",
    title: "Algorithm Problem 317",
    difficulty: "Hard",
    category: "Bit Manipulation",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 317. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve317(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve317(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve317(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-318": {
    id: "problem-318",
    title: "Algorithm Problem 318",
    difficulty: "Hard",
    category: "Array • Hash Table",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 318. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve318(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve318(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve318(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-319": {
    id: "problem-319",
    title: "Algorithm Problem 319",
    difficulty: "Medium",
    category: "Heap",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 319. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve319(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve319(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve319(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-320": {
    id: "problem-320",
    title: "Algorithm Problem 320",
    difficulty: "Easy",
    category: "Sliding Window",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 320. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve320(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve320(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve320(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-321": {
    id: "problem-321",
    title: "Algorithm Problem 321",
    difficulty: "Hard",
    category: "Array • Hash Table",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 321. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve321(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve321(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve321(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-322": {
    id: "problem-322",
    title: "Algorithm Problem 322",
    difficulty: "Medium",
    category: "Sliding Window",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 322. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve322(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve322(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve322(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-323": {
    id: "problem-323",
    title: "Algorithm Problem 323",
    difficulty: "Medium",
    category: "Dynamic Programming",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 323. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve323(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve323(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve323(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-324": {
    id: "problem-324",
    title: "Algorithm Problem 324",
    difficulty: "Easy",
    category: "Tree • DFS",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 324. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve324(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve324(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve324(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-325": {
    id: "problem-325",
    title: "Algorithm Problem 325",
    difficulty: "Medium",
    category: "Tree • DFS",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 325. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve325(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve325(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve325(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-326": {
    id: "problem-326",
    title: "Algorithm Problem 326",
    difficulty: "Medium",
    category: "Tree • DFS",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 326. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve326(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve326(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve326(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-327": {
    id: "problem-327",
    title: "Algorithm Problem 327",
    difficulty: "Hard",
    category: "Bit Manipulation",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 327. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve327(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve327(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve327(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-328": {
    id: "problem-328",
    title: "Algorithm Problem 328",
    difficulty: "Easy",
    category: "Tree • DFS",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 328. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve328(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve328(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve328(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-329": {
    id: "problem-329",
    title: "Algorithm Problem 329",
    difficulty: "Hard",
    category: "Tree • DFS",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 329. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve329(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve329(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve329(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-330": {
    id: "problem-330",
    title: "Algorithm Problem 330",
    difficulty: "Medium",
    category: "Tree • DFS",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 330. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve330(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve330(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve330(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-331": {
    id: "problem-331",
    title: "Algorithm Problem 331",
    difficulty: "Easy",
    category: "Math",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 331. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve331(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve331(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve331(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-332": {
    id: "problem-332",
    title: "Algorithm Problem 332",
    difficulty: "Hard",
    category: "Tree • DFS",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 332. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve332(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve332(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve332(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-333": {
    id: "problem-333",
    title: "Algorithm Problem 333",
    difficulty: "Easy",
    category: "Graph • BFS",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 333. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve333(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve333(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve333(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-334": {
    id: "problem-334",
    title: "Algorithm Problem 334",
    difficulty: "Medium",
    category: "Sliding Window",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 334. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve334(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve334(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve334(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-335": {
    id: "problem-335",
    title: "Algorithm Problem 335",
    difficulty: "Easy",
    category: "Sliding Window",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 335. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve335(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve335(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve335(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-336": {
    id: "problem-336",
    title: "Algorithm Problem 336",
    difficulty: "Hard",
    category: "Graph • BFS",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 336. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve336(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve336(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve336(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-337": {
    id: "problem-337",
    title: "Algorithm Problem 337",
    difficulty: "Hard",
    category: "Tree • DFS",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 337. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve337(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve337(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve337(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-338": {
    id: "problem-338",
    title: "Algorithm Problem 338",
    difficulty: "Medium",
    category: "Bit Manipulation",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 338. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve338(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve338(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve338(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-339": {
    id: "problem-339",
    title: "Algorithm Problem 339",
    difficulty: "Hard",
    category: "Greedy",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 339. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve339(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve339(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve339(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-340": {
    id: "problem-340",
    title: "Algorithm Problem 340",
    difficulty: "Easy",
    category: "Binary Search",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 340. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve340(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve340(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve340(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-341": {
    id: "problem-341",
    title: "Algorithm Problem 341",
    difficulty: "Medium",
    category: "Sliding Window",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 341. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve341(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve341(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve341(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-342": {
    id: "problem-342",
    title: "Algorithm Problem 342",
    difficulty: "Hard",
    category: "Math",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 342. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve342(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve342(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve342(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-343": {
    id: "problem-343",
    title: "Algorithm Problem 343",
    difficulty: "Medium",
    category: "Backtracking",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 343. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve343(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve343(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve343(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-344": {
    id: "problem-344",
    title: "Algorithm Problem 344",
    difficulty: "Medium",
    category: "Greedy",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 344. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve344(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve344(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve344(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-345": {
    id: "problem-345",
    title: "Algorithm Problem 345",
    difficulty: "Easy",
    category: "Binary Search",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 345. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve345(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve345(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve345(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-346": {
    id: "problem-346",
    title: "Algorithm Problem 346",
    difficulty: "Medium",
    category: "Binary Search",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 346. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve346(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve346(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve346(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-347": {
    id: "problem-347",
    title: "Algorithm Problem 347",
    difficulty: "Medium",
    category: "Binary Search",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 347. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve347(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve347(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve347(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-348": {
    id: "problem-348",
    title: "Algorithm Problem 348",
    difficulty: "Hard",
    category: "Graph • BFS",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 348. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve348(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve348(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve348(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-349": {
    id: "problem-349",
    title: "Algorithm Problem 349",
    difficulty: "Easy",
    category: "Dynamic Programming",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 349. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve349(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve349(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve349(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-350": {
    id: "problem-350",
    title: "Algorithm Problem 350",
    difficulty: "Easy",
    category: "Sliding Window",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 350. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve350(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve350(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve350(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-351": {
    id: "problem-351",
    title: "Algorithm Problem 351",
    difficulty: "Medium",
    category: "Binary Search",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 351. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve351(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve351(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve351(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-352": {
    id: "problem-352",
    title: "Algorithm Problem 352",
    difficulty: "Hard",
    category: "Dynamic Programming",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 352. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve352(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve352(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve352(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-353": {
    id: "problem-353",
    title: "Algorithm Problem 353",
    difficulty: "Hard",
    category: "Binary Search",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 353. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve353(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve353(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve353(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-354": {
    id: "problem-354",
    title: "Algorithm Problem 354",
    difficulty: "Medium",
    category: "String • Two Pointers",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 354. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve354(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve354(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve354(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-355": {
    id: "problem-355",
    title: "Algorithm Problem 355",
    difficulty: "Hard",
    category: "Greedy",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 355. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve355(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve355(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve355(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-356": {
    id: "problem-356",
    title: "Algorithm Problem 356",
    difficulty: "Medium",
    category: "Dynamic Programming",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 356. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve356(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve356(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve356(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-357": {
    id: "problem-357",
    title: "Algorithm Problem 357",
    difficulty: "Medium",
    category: "Tree • DFS",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 357. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve357(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve357(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve357(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-358": {
    id: "problem-358",
    title: "Algorithm Problem 358",
    difficulty: "Easy",
    category: "Heap",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 358. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve358(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve358(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve358(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-359": {
    id: "problem-359",
    title: "Algorithm Problem 359",
    difficulty: "Medium",
    category: "Bit Manipulation",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 359. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve359(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve359(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve359(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-360": {
    id: "problem-360",
    title: "Algorithm Problem 360",
    difficulty: "Medium",
    category: "Greedy",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 360. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve360(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve360(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve360(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-361": {
    id: "problem-361",
    title: "Algorithm Problem 361",
    difficulty: "Medium",
    category: "Bit Manipulation",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 361. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve361(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve361(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve361(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-362": {
    id: "problem-362",
    title: "Algorithm Problem 362",
    difficulty: "Hard",
    category: "Dynamic Programming",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 362. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve362(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve362(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve362(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-363": {
    id: "problem-363",
    title: "Algorithm Problem 363",
    difficulty: "Easy",
    category: "Linked List",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 363. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve363(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve363(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve363(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-364": {
    id: "problem-364",
    title: "Algorithm Problem 364",
    difficulty: "Hard",
    category: "Sliding Window",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 364. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve364(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve364(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve364(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-365": {
    id: "problem-365",
    title: "Algorithm Problem 365",
    difficulty: "Medium",
    category: "Sliding Window",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 365. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve365(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve365(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve365(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-366": {
    id: "problem-366",
    title: "Algorithm Problem 366",
    difficulty: "Medium",
    category: "Sliding Window",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 366. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve366(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve366(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve366(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-367": {
    id: "problem-367",
    title: "Algorithm Problem 367",
    difficulty: "Medium",
    category: "String • Two Pointers",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 367. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve367(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve367(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve367(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-368": {
    id: "problem-368",
    title: "Algorithm Problem 368",
    difficulty: "Hard",
    category: "Heap",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 368. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve368(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve368(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve368(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-369": {
    id: "problem-369",
    title: "Algorithm Problem 369",
    difficulty: "Medium",
    category: "Math",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 369. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve369(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve369(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve369(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-370": {
    id: "problem-370",
    title: "Algorithm Problem 370",
    difficulty: "Hard",
    category: "Greedy",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 370. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve370(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve370(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve370(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-371": {
    id: "problem-371",
    title: "Algorithm Problem 371",
    difficulty: "Easy",
    category: "Greedy",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 371. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve371(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve371(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve371(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-372": {
    id: "problem-372",
    title: "Algorithm Problem 372",
    difficulty: "Hard",
    category: "Bit Manipulation",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 372. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve372(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve372(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve372(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-373": {
    id: "problem-373",
    title: "Algorithm Problem 373",
    difficulty: "Easy",
    category: "Tree • DFS",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 373. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve373(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve373(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve373(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-374": {
    id: "problem-374",
    title: "Algorithm Problem 374",
    difficulty: "Hard",
    category: "Graph • BFS",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 374. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve374(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve374(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve374(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-375": {
    id: "problem-375",
    title: "Algorithm Problem 375",
    difficulty: "Medium",
    category: "String • Two Pointers",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 375. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve375(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve375(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve375(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-376": {
    id: "problem-376",
    title: "Algorithm Problem 376",
    difficulty: "Hard",
    category: "Graph • BFS",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 376. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve376(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve376(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve376(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-377": {
    id: "problem-377",
    title: "Algorithm Problem 377",
    difficulty: "Easy",
    category: "Bit Manipulation",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 377. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve377(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve377(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve377(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-378": {
    id: "problem-378",
    title: "Algorithm Problem 378",
    difficulty: "Hard",
    category: "Linked List",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 378. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve378(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve378(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve378(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-379": {
    id: "problem-379",
    title: "Algorithm Problem 379",
    difficulty: "Medium",
    category: "Backtracking",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 379. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve379(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve379(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve379(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-380": {
    id: "problem-380",
    title: "Algorithm Problem 380",
    difficulty: "Easy",
    category: "Linked List",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 380. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve380(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve380(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve380(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-381": {
    id: "problem-381",
    title: "Algorithm Problem 381",
    difficulty: "Hard",
    category: "Linked List",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 381. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve381(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve381(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve381(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-382": {
    id: "problem-382",
    title: "Algorithm Problem 382",
    difficulty: "Easy",
    category: "Greedy",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 382. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve382(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve382(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve382(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-383": {
    id: "problem-383",
    title: "Algorithm Problem 383",
    difficulty: "Hard",
    category: "Bit Manipulation",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 383. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve383(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve383(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve383(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-384": {
    id: "problem-384",
    title: "Algorithm Problem 384",
    difficulty: "Hard",
    category: "Sliding Window",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 384. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve384(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve384(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve384(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-385": {
    id: "problem-385",
    title: "Algorithm Problem 385",
    difficulty: "Easy",
    category: "Greedy",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 385. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve385(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve385(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve385(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-386": {
    id: "problem-386",
    title: "Algorithm Problem 386",
    difficulty: "Easy",
    category: "Array • Hash Table",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 386. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve386(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve386(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve386(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-387": {
    id: "problem-387",
    title: "Algorithm Problem 387",
    difficulty: "Easy",
    category: "Tree • DFS",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 387. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve387(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve387(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve387(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-388": {
    id: "problem-388",
    title: "Algorithm Problem 388",
    difficulty: "Hard",
    category: "Tree • DFS",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 388. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve388(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve388(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve388(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-389": {
    id: "problem-389",
    title: "Algorithm Problem 389",
    difficulty: "Medium",
    category: "Sliding Window",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 389. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve389(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve389(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve389(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-390": {
    id: "problem-390",
    title: "Algorithm Problem 390",
    difficulty: "Medium",
    category: "Heap",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 390. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve390(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve390(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve390(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-391": {
    id: "problem-391",
    title: "Algorithm Problem 391",
    difficulty: "Easy",
    category: "Bit Manipulation",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 391. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve391(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve391(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve391(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-392": {
    id: "problem-392",
    title: "Algorithm Problem 392",
    difficulty: "Easy",
    category: "Tree • DFS",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 392. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve392(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve392(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve392(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-393": {
    id: "problem-393",
    title: "Algorithm Problem 393",
    difficulty: "Easy",
    category: "Sliding Window",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 393. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve393(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve393(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve393(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-394": {
    id: "problem-394",
    title: "Algorithm Problem 394",
    difficulty: "Medium",
    category: "Graph • BFS",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 394. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve394(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve394(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve394(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-395": {
    id: "problem-395",
    title: "Algorithm Problem 395",
    difficulty: "Hard",
    category: "Sliding Window",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 395. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve395(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve395(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve395(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-396": {
    id: "problem-396",
    title: "Algorithm Problem 396",
    difficulty: "Easy",
    category: "Dynamic Programming",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 396. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve396(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve396(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve396(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-397": {
    id: "problem-397",
    title: "Algorithm Problem 397",
    difficulty: "Easy",
    category: "Sliding Window",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 397. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve397(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve397(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve397(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-398": {
    id: "problem-398",
    title: "Algorithm Problem 398",
    difficulty: "Easy",
    category: "Heap",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 398. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve398(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve398(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve398(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-399": {
    id: "problem-399",
    title: "Algorithm Problem 399",
    difficulty: "Hard",
    category: "Graph • BFS",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 399. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve399(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve399(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve399(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-400": {
    id: "problem-400",
    title: "Algorithm Problem 400",
    difficulty: "Medium",
    category: "Math",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 400. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve400(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve400(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve400(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-401": {
    id: "problem-401",
    title: "Algorithm Problem 401",
    difficulty: "Medium",
    category: "Bit Manipulation",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 401. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve401(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve401(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve401(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-402": {
    id: "problem-402",
    title: "Algorithm Problem 402",
    difficulty: "Easy",
    category: "Backtracking",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 402. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve402(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve402(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve402(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-403": {
    id: "problem-403",
    title: "Algorithm Problem 403",
    difficulty: "Medium",
    category: "Binary Search",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 403. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve403(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve403(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve403(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-404": {
    id: "problem-404",
    title: "Algorithm Problem 404",
    difficulty: "Medium",
    category: "Dynamic Programming",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 404. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve404(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve404(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve404(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-405": {
    id: "problem-405",
    title: "Algorithm Problem 405",
    difficulty: "Easy",
    category: "Heap",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 405. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve405(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve405(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve405(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-406": {
    id: "problem-406",
    title: "Algorithm Problem 406",
    difficulty: "Easy",
    category: "Math",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 406. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve406(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve406(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve406(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-407": {
    id: "problem-407",
    title: "Algorithm Problem 407",
    difficulty: "Easy",
    category: "Sliding Window",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 407. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve407(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve407(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve407(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-408": {
    id: "problem-408",
    title: "Algorithm Problem 408",
    difficulty: "Hard",
    category: "Math",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 408. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve408(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve408(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve408(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-409": {
    id: "problem-409",
    title: "Algorithm Problem 409",
    difficulty: "Easy",
    category: "Heap",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 409. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve409(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve409(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve409(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-410": {
    id: "problem-410",
    title: "Algorithm Problem 410",
    difficulty: "Easy",
    category: "Array • Hash Table",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 410. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve410(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve410(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve410(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-411": {
    id: "problem-411",
    title: "Algorithm Problem 411",
    difficulty: "Easy",
    category: "Greedy",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 411. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve411(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve411(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve411(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-412": {
    id: "problem-412",
    title: "Algorithm Problem 412",
    difficulty: "Medium",
    category: "Bit Manipulation",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 412. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve412(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve412(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve412(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-413": {
    id: "problem-413",
    title: "Algorithm Problem 413",
    difficulty: "Easy",
    category: "Sliding Window",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 413. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve413(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve413(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve413(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-414": {
    id: "problem-414",
    title: "Algorithm Problem 414",
    difficulty: "Easy",
    category: "Binary Search",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 414. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve414(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve414(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve414(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-415": {
    id: "problem-415",
    title: "Algorithm Problem 415",
    difficulty: "Medium",
    category: "Greedy",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 415. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve415(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve415(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve415(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-416": {
    id: "problem-416",
    title: "Algorithm Problem 416",
    difficulty: "Easy",
    category: "Array • Hash Table",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 416. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve416(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve416(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve416(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-417": {
    id: "problem-417",
    title: "Algorithm Problem 417",
    difficulty: "Easy",
    category: "Binary Search",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 417. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve417(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve417(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve417(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-418": {
    id: "problem-418",
    title: "Algorithm Problem 418",
    difficulty: "Easy",
    category: "String • Two Pointers",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 418. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve418(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve418(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve418(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-419": {
    id: "problem-419",
    title: "Algorithm Problem 419",
    difficulty: "Easy",
    category: "Binary Search",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 419. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve419(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve419(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve419(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-420": {
    id: "problem-420",
    title: "Algorithm Problem 420",
    difficulty: "Medium",
    category: "Tree • DFS",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 420. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve420(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve420(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve420(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-421": {
    id: "problem-421",
    title: "Algorithm Problem 421",
    difficulty: "Hard",
    category: "Binary Search",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 421. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve421(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve421(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve421(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-422": {
    id: "problem-422",
    title: "Algorithm Problem 422",
    difficulty: "Easy",
    category: "Heap",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 422. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve422(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve422(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve422(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-423": {
    id: "problem-423",
    title: "Algorithm Problem 423",
    difficulty: "Easy",
    category: "Binary Search",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 423. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve423(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve423(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve423(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-424": {
    id: "problem-424",
    title: "Algorithm Problem 424",
    difficulty: "Medium",
    category: "Tree • DFS",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 424. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve424(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve424(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve424(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-425": {
    id: "problem-425",
    title: "Algorithm Problem 425",
    difficulty: "Easy",
    category: "Greedy",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 425. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve425(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve425(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve425(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-426": {
    id: "problem-426",
    title: "Algorithm Problem 426",
    difficulty: "Easy",
    category: "Math",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 426. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve426(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve426(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve426(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-427": {
    id: "problem-427",
    title: "Algorithm Problem 427",
    difficulty: "Easy",
    category: "Array • Hash Table",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 427. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve427(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve427(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve427(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-428": {
    id: "problem-428",
    title: "Algorithm Problem 428",
    difficulty: "Easy",
    category: "String • Two Pointers",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 428. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve428(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve428(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve428(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-429": {
    id: "problem-429",
    title: "Algorithm Problem 429",
    difficulty: "Easy",
    category: "Greedy",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 429. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve429(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve429(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve429(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-430": {
    id: "problem-430",
    title: "Algorithm Problem 430",
    difficulty: "Easy",
    category: "Greedy",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 430. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve430(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve430(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve430(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-431": {
    id: "problem-431",
    title: "Algorithm Problem 431",
    difficulty: "Hard",
    category: "Heap",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 431. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve431(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve431(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve431(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-432": {
    id: "problem-432",
    title: "Algorithm Problem 432",
    difficulty: "Medium",
    category: "Heap",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 432. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve432(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve432(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve432(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-433": {
    id: "problem-433",
    title: "Algorithm Problem 433",
    difficulty: "Medium",
    category: "Array • Hash Table",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 433. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve433(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve433(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve433(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-434": {
    id: "problem-434",
    title: "Algorithm Problem 434",
    difficulty: "Hard",
    category: "Tree • DFS",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 434. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve434(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve434(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve434(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-435": {
    id: "problem-435",
    title: "Algorithm Problem 435",
    difficulty: "Medium",
    category: "Tree • DFS",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 435. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve435(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve435(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve435(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-436": {
    id: "problem-436",
    title: "Algorithm Problem 436",
    difficulty: "Hard",
    category: "Bit Manipulation",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 436. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve436(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve436(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve436(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-437": {
    id: "problem-437",
    title: "Algorithm Problem 437",
    difficulty: "Hard",
    category: "Dynamic Programming",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 437. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve437(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve437(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve437(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-438": {
    id: "problem-438",
    title: "Algorithm Problem 438",
    difficulty: "Medium",
    category: "Array • Hash Table",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 438. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve438(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve438(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve438(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-439": {
    id: "problem-439",
    title: "Algorithm Problem 439",
    difficulty: "Hard",
    category: "Bit Manipulation",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 439. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve439(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve439(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve439(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-440": {
    id: "problem-440",
    title: "Algorithm Problem 440",
    difficulty: "Medium",
    category: "Bit Manipulation",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 440. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve440(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve440(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve440(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-441": {
    id: "problem-441",
    title: "Algorithm Problem 441",
    difficulty: "Medium",
    category: "Tree • DFS",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 441. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve441(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve441(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve441(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-442": {
    id: "problem-442",
    title: "Algorithm Problem 442",
    difficulty: "Hard",
    category: "Binary Search",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 442. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve442(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve442(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve442(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-443": {
    id: "problem-443",
    title: "Algorithm Problem 443",
    difficulty: "Hard",
    category: "Tree • DFS",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 443. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve443(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve443(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve443(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-444": {
    id: "problem-444",
    title: "Algorithm Problem 444",
    difficulty: "Easy",
    category: "Array • Hash Table",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 444. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve444(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve444(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve444(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-445": {
    id: "problem-445",
    title: "Algorithm Problem 445",
    difficulty: "Medium",
    category: "String • Two Pointers",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 445. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve445(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve445(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve445(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-446": {
    id: "problem-446",
    title: "Algorithm Problem 446",
    difficulty: "Medium",
    category: "Bit Manipulation",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 446. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve446(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve446(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve446(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-447": {
    id: "problem-447",
    title: "Algorithm Problem 447",
    difficulty: "Easy",
    category: "Array • Hash Table",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 447. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve447(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve447(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve447(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-448": {
    id: "problem-448",
    title: "Algorithm Problem 448",
    difficulty: "Hard",
    category: "Greedy",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 448. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve448(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve448(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve448(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-449": {
    id: "problem-449",
    title: "Algorithm Problem 449",
    difficulty: "Medium",
    category: "String • Two Pointers",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 449. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve449(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve449(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve449(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-450": {
    id: "problem-450",
    title: "Algorithm Problem 450",
    difficulty: "Medium",
    category: "Linked List",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 450. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve450(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve450(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve450(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-451": {
    id: "problem-451",
    title: "Algorithm Problem 451",
    difficulty: "Hard",
    category: "Array • Hash Table",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 451. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve451(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve451(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve451(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-452": {
    id: "problem-452",
    title: "Algorithm Problem 452",
    difficulty: "Hard",
    category: "Heap",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 452. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve452(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve452(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve452(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-453": {
    id: "problem-453",
    title: "Algorithm Problem 453",
    difficulty: "Hard",
    category: "Dynamic Programming",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 453. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve453(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve453(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve453(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-454": {
    id: "problem-454",
    title: "Algorithm Problem 454",
    difficulty: "Medium",
    category: "Graph • BFS",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 454. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve454(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve454(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve454(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-455": {
    id: "problem-455",
    title: "Algorithm Problem 455",
    difficulty: "Hard",
    category: "Heap",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 455. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve455(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve455(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve455(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-456": {
    id: "problem-456",
    title: "Algorithm Problem 456",
    difficulty: "Medium",
    category: "String • Two Pointers",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 456. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve456(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve456(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve456(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-457": {
    id: "problem-457",
    title: "Algorithm Problem 457",
    difficulty: "Medium",
    category: "Array • Hash Table",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 457. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve457(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve457(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve457(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-458": {
    id: "problem-458",
    title: "Algorithm Problem 458",
    difficulty: "Hard",
    category: "Binary Search",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 458. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve458(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve458(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve458(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-459": {
    id: "problem-459",
    title: "Algorithm Problem 459",
    difficulty: "Medium",
    category: "String • Two Pointers",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 459. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve459(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve459(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve459(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-460": {
    id: "problem-460",
    title: "Algorithm Problem 460",
    difficulty: "Hard",
    category: "Math",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 460. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve460(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve460(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve460(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-461": {
    id: "problem-461",
    title: "Algorithm Problem 461",
    difficulty: "Hard",
    category: "Binary Search",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 461. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve461(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve461(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve461(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-462": {
    id: "problem-462",
    title: "Algorithm Problem 462",
    difficulty: "Medium",
    category: "Sliding Window",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 462. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve462(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve462(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve462(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-463": {
    id: "problem-463",
    title: "Algorithm Problem 463",
    difficulty: "Easy",
    category: "Binary Search",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 463. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve463(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve463(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve463(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-464": {
    id: "problem-464",
    title: "Algorithm Problem 464",
    difficulty: "Hard",
    category: "Bit Manipulation",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 464. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve464(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve464(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve464(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-465": {
    id: "problem-465",
    title: "Algorithm Problem 465",
    difficulty: "Easy",
    category: "Linked List",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 465. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve465(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve465(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve465(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-466": {
    id: "problem-466",
    title: "Algorithm Problem 466",
    difficulty: "Easy",
    category: "Graph • BFS",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 466. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve466(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve466(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve466(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-467": {
    id: "problem-467",
    title: "Algorithm Problem 467",
    difficulty: "Easy",
    category: "Bit Manipulation",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 467. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve467(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve467(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve467(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-468": {
    id: "problem-468",
    title: "Algorithm Problem 468",
    difficulty: "Medium",
    category: "Array • Hash Table",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 468. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve468(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve468(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve468(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-469": {
    id: "problem-469",
    title: "Algorithm Problem 469",
    difficulty: "Easy",
    category: "Heap",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 469. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve469(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve469(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve469(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-470": {
    id: "problem-470",
    title: "Algorithm Problem 470",
    difficulty: "Hard",
    category: "Backtracking",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 470. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve470(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve470(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve470(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-471": {
    id: "problem-471",
    title: "Algorithm Problem 471",
    difficulty: "Medium",
    category: "Binary Search",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 471. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve471(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve471(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve471(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-472": {
    id: "problem-472",
    title: "Algorithm Problem 472",
    difficulty: "Medium",
    category: "Math",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 472. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve472(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve472(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve472(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-473": {
    id: "problem-473",
    title: "Algorithm Problem 473",
    difficulty: "Medium",
    category: "Graph • BFS",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 473. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve473(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve473(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve473(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-474": {
    id: "problem-474",
    title: "Algorithm Problem 474",
    difficulty: "Easy",
    category: "Sliding Window",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 474. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve474(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve474(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve474(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-475": {
    id: "problem-475",
    title: "Algorithm Problem 475",
    difficulty: "Hard",
    category: "Greedy",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 475. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve475(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve475(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve475(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-476": {
    id: "problem-476",
    title: "Algorithm Problem 476",
    difficulty: "Easy",
    category: "Linked List",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 476. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve476(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve476(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve476(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-477": {
    id: "problem-477",
    title: "Algorithm Problem 477",
    difficulty: "Hard",
    category: "Binary Search",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 477. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve477(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve477(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve477(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-478": {
    id: "problem-478",
    title: "Algorithm Problem 478",
    difficulty: "Easy",
    category: "Bit Manipulation",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 478. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve478(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve478(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve478(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-479": {
    id: "problem-479",
    title: "Algorithm Problem 479",
    difficulty: "Hard",
    category: "Dynamic Programming",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 479. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve479(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve479(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve479(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-480": {
    id: "problem-480",
    title: "Algorithm Problem 480",
    difficulty: "Medium",
    category: "Heap",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 480. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve480(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve480(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve480(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-481": {
    id: "problem-481",
    title: "Algorithm Problem 481",
    difficulty: "Easy",
    category: "Sliding Window",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 481. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve481(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve481(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve481(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-482": {
    id: "problem-482",
    title: "Algorithm Problem 482",
    difficulty: "Medium",
    category: "Sliding Window",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 482. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve482(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve482(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve482(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-483": {
    id: "problem-483",
    title: "Algorithm Problem 483",
    difficulty: "Medium",
    category: "Linked List",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 483. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve483(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve483(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve483(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-484": {
    id: "problem-484",
    title: "Algorithm Problem 484",
    difficulty: "Hard",
    category: "Backtracking",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 484. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve484(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve484(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve484(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-485": {
    id: "problem-485",
    title: "Algorithm Problem 485",
    difficulty: "Easy",
    category: "Math",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 485. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve485(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve485(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve485(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-486": {
    id: "problem-486",
    title: "Algorithm Problem 486",
    difficulty: "Hard",
    category: "Tree • DFS",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 486. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve486(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve486(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve486(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-487": {
    id: "problem-487",
    title: "Algorithm Problem 487",
    difficulty: "Easy",
    category: "Backtracking",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 487. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve487(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve487(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve487(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-488": {
    id: "problem-488",
    title: "Algorithm Problem 488",
    difficulty: "Medium",
    category: "Linked List",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 488. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve488(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve488(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve488(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-489": {
    id: "problem-489",
    title: "Algorithm Problem 489",
    difficulty: "Easy",
    category: "Linked List",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 489. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve489(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve489(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve489(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-490": {
    id: "problem-490",
    title: "Algorithm Problem 490",
    difficulty: "Hard",
    category: "Binary Search",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 490. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve490(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve490(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve490(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-491": {
    id: "problem-491",
    title: "Algorithm Problem 491",
    difficulty: "Easy",
    category: "Math",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 491. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve491(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve491(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve491(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-492": {
    id: "problem-492",
    title: "Algorithm Problem 492",
    difficulty: "Easy",
    category: "Bit Manipulation",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 492. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve492(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve492(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve492(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-493": {
    id: "problem-493",
    title: "Algorithm Problem 493",
    difficulty: "Easy",
    category: "Sliding Window",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 493. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve493(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve493(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve493(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-494": {
    id: "problem-494",
    title: "Algorithm Problem 494",
    difficulty: "Hard",
    category: "Bit Manipulation",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 494. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve494(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve494(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve494(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-495": {
    id: "problem-495",
    title: "Algorithm Problem 495",
    difficulty: "Hard",
    category: "Binary Search",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 495. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve495(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve495(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve495(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-496": {
    id: "problem-496",
    title: "Algorithm Problem 496",
    difficulty: "Hard",
    category: "Backtracking",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 496. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve496(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve496(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve496(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-497": {
    id: "problem-497",
    title: "Algorithm Problem 497",
    difficulty: "Medium",
    category: "Graph • BFS",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 497. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve497(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve497(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve497(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-498": {
    id: "problem-498",
    title: "Algorithm Problem 498",
    difficulty: "Medium",
    category: "Backtracking",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 498. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve498(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve498(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve498(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-499": {
    id: "problem-499",
    title: "Algorithm Problem 499",
    difficulty: "Medium",
    category: "Tree • DFS",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 499. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve499(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve499(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve499(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  },
  "problem-500": {
    id: "problem-500",
    title: "Algorithm Problem 500",
    difficulty: "Easy",
    category: "Backtracking",
    description: {
      text: "This is an auto-generated mock problem simulating LeetCode problem 500. Given an input array 'nums', compute the required output.",
      notes: ["Solve this in O(n) time and O(1) space."]
    },
    examples: [
      { input: "nums = [1, 2, 3]", output: "42", explanation: "Because 42 is the answer to everything." }
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: {
      javascript: "function solve500(nums) {\n  // Write your solution here\n  return 42;\n}",
      python: "def solve500(nums):\n    # Write your solution here\n    return 42",
      java: "class Solution {\n    public int solve500(int[] nums) {\n        // Write your solution here\n        return 42;\n    }\n}"
    },
    expectedOutput: {
      javascript: "42",
      python: "42",
      java: "42"
    }
  }
};

export const LANGUAGE_CONFIG = {
  javascript: {
    name: "JavaScript",
    icon: "/javascript.png",
    monacoLang: "javascript",
  },
  python: {
    name: "Python",
    icon: "/python.png",
    monacoLang: "python",
  },
  java: {
    name: "Java",
    icon: "/java.png",
    monacoLang: "java",
  },
};
