package main

import (
	"html/template"
	"os"
)

func main() {
	wd, err := os.Getwd()
	if err != nil {
		panic(err)
	}
	t, err := template.ParseFiles(wd + "/src/templates/result.html")
	if err != nil {
		panic(err)
	}

	data := struct {
		ImageUrl string
	}{
		ImageUrl: "https://private-user-images.githubusercontent.com/15419227/301766752-a993f29f-da63-4181-bc42-cd3ca61583b3.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3MTIxMjUzNzAsIm5iZiI6MTcxMjEyNTA3MCwicGF0aCI6Ii8xNTQxOTIyNy8zMDE3NjY3NTItYTk5M2YyOWYtZGE2My00MTgxLWJjNDItY2QzY2E2MTU4M2IzLnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNDA0MDMlMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjQwNDAzVDA2MTc1MFomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPTI3YTlmY2JlYjQ3NDkwMzljZGM5MmJjOGIwM2RlYzgyNTFmMWVkZTAyNGZkZDNiODJiNzdjYWRjODNmOTEzMjcmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0JmFjdG9yX2lkPTAma2V5X2lkPTAmcmVwb19pZD0wIn0.VjSkegDc5BbpsohZaKXdcFBJ4aTXazMPnVvTBwbnF-8",
	}

	f, err := os.Create(wd + "/dist/output.html")
	if err != nil {
		panic(err)
	}
	defer f.Close()

	err = t.Execute(f, data)
	if err != nil {
		panic(err)
	}
}
