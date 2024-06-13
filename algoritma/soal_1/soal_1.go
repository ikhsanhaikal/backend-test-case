package soal1

import (
	"strconv"
	"strings"
)

func soal1(s string) string {
	var newString []string
	var digits []string
	for i := len(s) - 1; i >= 0; i-- {
		var char = s[i : i+1]
		if _, err := strconv.Atoi(char); err == nil {
			digits = append([]string{char}, digits...)
		} else {
			newString = append(newString, char)
		}
	}
	newString = append(newString, digits...)

	return strings.Join(newString, "")
}
