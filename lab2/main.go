package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

const (
	owner = "openai"        // Replace with the repo owner's username
	repo  = "openai-python" // Replace with the repository name
	path  = ""              // Directory path within the repo (leave empty for root)
)

// Define a struct to parse the JSON response
type GithubContent struct {
	Name string `json:"name"`
	Type string `json:"type"` // "file" or "dir"
}

func main() {

	// Construct the API URL
	apiUrl := fmt.Sprintf("https://api.github.com/repos/%s/%s/contents/%s", owner, repo, path)

	// Create a new request
	req, err := http.NewRequest("GET", apiUrl, nil)
	if err != nil {
		fmt.Println("Error creating request:", err)
		return
	}

	// Note: No Authorization header is set for public repository access

	// Make the request
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		fmt.Println("Error making request:", err)
		return
	}
	defer resp.Body.Close()

	// Check for a successful response
	if resp.StatusCode != http.StatusOK {
		fmt.Printf("API request failed with status code: %d\n", resp.StatusCode)
		return
	}

	// Read the response body
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		fmt.Println("Error reading response body:", err)
		return
	}

	// Parse the JSON response
	var contents []GithubContent
	if err := json.Unmarshal(body, &contents); err != nil {
		fmt.Println("Error parsing JSON response:", err)
		return
	}

	// Print the file and directory names
	for _, content := range contents {
		fmt.Printf("%s (%s)\n", content.Name, content.Type)
	}
}
