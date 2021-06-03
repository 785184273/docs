# 排序算法

最常用的排序算法有冒泡排序、选择排序、插入排序、希尔排序、归并排序、快速排序、计数排序、桶排序、基数排序、顺序排序

**按照运行时间来看，冒泡排序是最差的一个**

依次从最慢的开始，然后是性能较好的排序

## 冒泡排序
冒泡排序比较所有相邻的两个项，如果第一个比第二个大（或小，按需求决定）则交换位置，元素项向上移动至正确的顺序
``` js

function BubbleSort (arr) {
  const { length } = arr
  for (let i = 0; i < length; ++i) {
    for (let j = 0; j < length - 1 - i; ++j) {
      if (arr[j + 1] > arr[j]) { // 如果后面的那个大于前面的那个则交换位置
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
      }
    }
  }
  return arr
}
BubbleSort([1, 5, 2, 4, 3])
```
## 选择排序
选择排序的思路是找到数据结构中的最小值并将其放置在第一位，接着找到第二小的值并将其放在第二位，以此类推
``` js
function selectionSort (arr) {
  const { length } = arr
  for (let i = 0; i < length - 1; ++i) {
    // 外循环第一次循环获取数组中的最小值，第二次获取数组中第二小值，以此类推
    let minIndex = i
    for (let j = i; j < length; ++j) {
      if (arr[minIndex] > arr[j]) minIndex = j
    }
    if (i != minIndex) {
      // 交换位置
      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]]
    }
  }
  return arr
}
BubbleSort([1, 5, 2, 4, 3])
```
