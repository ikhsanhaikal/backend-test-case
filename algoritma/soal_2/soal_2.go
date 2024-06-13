package soal2

import "strings"

func soal2(s string) string {
	words := strings.Split(s, " ")
	var currentLongestWord string = ""

	for _, word := range words {
		if len(word) > len(currentLongestWord) {
			currentLongestWord = word
		}
	}

	return currentLongestWord
}
