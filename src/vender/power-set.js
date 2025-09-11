export default function bwPowerSet(originalSet) {
  const subSets = [];

  // 我们将会有 2^n 种可能的组合（其中 n 是原始集合的长度）。
  // 因为对于原始集合的每个元素，我们都要决定是否包含它，
  // 所以每个元素都有两种选择（包含或不包含）。
  const numberOfCombinations = 2 ** originalSet.length;

  // 每一个从 0 到 2^n 的数字的二进制表示正好符合我们的需求：
  // 它的每一位（二进制位，0 或 1）表示是否要包含集合中的对应元素。
  // 例如，对于集合 {1, 2, 3}，二进制数 0b010 表示我们只需要
  // 在当前子集中包含“2”。
  for (
    let combinationIndex = 0;
    combinationIndex < numberOfCombinations;
    combinationIndex += 1
  ) {
    const subSet = [];

    for (
      let setElementIndex = 0;
      setElementIndex < originalSet.length;
      setElementIndex += 1
    ) {
      // 决定是否需要把当前元素加入到子集中。
      if (combinationIndex & (1 << setElementIndex)) {
        subSet.push(originalSet[setElementIndex]);
      }
    }

    // 将当前子集加入到所有子集的列表中。
    subSets.push(subSet);
  }

  return subSets;
}
