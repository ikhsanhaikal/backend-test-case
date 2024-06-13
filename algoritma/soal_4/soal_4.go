package soal4

import "fmt"

func soal4(m [][]int) int {
	diagoal1 := 0
	diagoal2 := 0
	for k, r := range m {
		diagoal1 += r[k]
		diagoal2 += r[len(r)-1-k]
	}
	fmt.Printf("diagonal1: %d", diagoal1)
	fmt.Printf("diagonal2: %d", diagoal2)
	return diagoal1 - diagoal2
}

// 2 0 8
// 3 6 0
// 2 3 2

// 0 1 5 1 -> k:0 -> 0 3
// 6 0 6 8 -> k:1 -> 1 2
// 7 5 3 6 -> k:2 -> 2 1
// 7 5 4 5 -> k:3 -> 3 0
