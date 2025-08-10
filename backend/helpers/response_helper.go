package helpers

import (
	"library-books/utils"
	"net/http"

	"github.com/gin-gonic/gin"
)

type Response struct {
	Code    int         `json:"code"`
	Message string      `json:"message,omitempty"`
	Data    interface{} `json:"data,omitempty"`
}

func Success(ctx *gin.Context, code int, message string, data interface{}) {
	language := ctx.Query("lang")
	localizeMessage := ""

	if language != "" {
		langLocalize := utils.GetLocalizer(language)
		localizeMessage = utils.LocalizeString(langLocalize, message, map[string]interface{}{})
	} else {
		localizeMessage = utils.LocalizeStringMessage(ctx, message)
	}

	ctx.JSON(http.StatusOK, Response{
		Code:    code,
		Message: localizeMessage,
		Data:    data,
	})
}

func BadRequest(ctx *gin.Context, code int, message string) {
	language := ctx.Query("lang")
	localizeMessage := ""

	if language != "" {
		langLocalize := utils.GetLocalizer(language)
		localizeMessage = utils.LocalizeString(langLocalize, message, map[string]interface{}{})
	} else {
		localizeMessage = utils.LocalizeStringMessage(ctx, message)
	}

	ctx.JSON(http.StatusBadRequest, Response{
		Code:    code,
		Message: localizeMessage,
	})
}

func NotFound(ctx *gin.Context, code int, message string) {
	language := ctx.Query("lang")
	localizeMessage := ""

	if language != "" {
		langLocalize := utils.GetLocalizer(language)
		localizeMessage = utils.LocalizeString(langLocalize, message, map[string]interface{}{})
	} else {
		localizeMessage = utils.LocalizeStringMessage(ctx, message)
	}

	ctx.JSON(http.StatusNotFound, Response{
		Code:    code,
		Message: localizeMessage,
	})
}

func ServerError(ctx *gin.Context, code int, message string) {
	language := ctx.Query("lang")
	localizeMessage := ""

	if language != "" {
		langLocalize := utils.GetLocalizer(language)
		localizeMessage = utils.LocalizeString(langLocalize, message, map[string]interface{}{})
	} else {
		localizeMessage = utils.LocalizeStringMessage(ctx, message)
	}

	ctx.JSON(http.StatusInternalServerError, Response{
		Code:    code,
		Message: localizeMessage,
	})
}
