# library-books

## Installation

- install all dependency with typing the command below

  ```bash
  go install or go get
  ```

- updated all dependency with typing the command below

  ```bash
  go mod tidy
  ```

- run the application with the command below

  ```bash
  $ go run main.go 
  
  Or, for live reload during development (requires Gin):
  
  $ gin -a 8080 -i run main.go 
  ```

## Requirement

- Go language version 1.22.1
- Mongodb database

## Generate Secret Key

`config.json` in field `jwt.secret` you can filled with random secret key. to get secret key you can follow this command:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'));"
```

## API Documentation

- For Swagger documentation, visit: [http://localhost:8080/swagger/index.html](http://localhost:8080/swagger/index.html)

## Adding Swagger Comments for New Endpoints

To document a new endpoint using Swagger in your Go code, add a comment block above your handler function following this format:

```go
// FunctionName godoc
// @Summary Brief summary of the endpoint
// @Description Detailed description of the endpoint
// @Tags tagName
// @Accept json
// @Produce json
// @Param paramName paramType dataType required "Description"
// @Success statusCode {object} helpers.Response "Success message"
// @Failure statusCode {object} helpers.Response "Error message"
// @Router /path [method]
```

**Example:**

```go
// CreateBookHandler godoc
// @Summary Create a new book
// @Description Add a new book to the library
// @Tags books
// @Accept json
// @Produce json
// @Param book body entity.Book true "Book data"
// @Success 201 {object} helpers.Response "Book created successfully"
// @Failure 400 {object} helpers.Response "Invalid input"
// @Failure 500 {object} helpers.Response "Server error"
// @Router /books [post]
```

After adding the comments, rebuild your Swagger docs by running:

```bash
swag init
```

Restart your application.
Visit [http://localhost:8080/swagger/index.html](http://localhost:8080/swagger/index.html) to see the updated documentation.
