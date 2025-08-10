package middleware

import (
	"encoding/json"

	"github.com/gin-gonic/gin"
	"github.com/nicksnyder/go-i18n/v2/i18n"
	"golang.org/x/text/language"
)

type LocalizerMiddleware struct {
	bundle *i18n.Bundle
}

// initialization of localizer middleware
func NewLocalizerMiddleware() *LocalizerMiddleware {
	// set default localizer
	bundle := i18n.NewBundle(language.English)

	// register load file localizer format file (.json)
	bundle.RegisterUnmarshalFunc("json", json.Unmarshal)
	bundle.LoadMessageFile("./lang/active.en.json")
	bundle.LoadMessageFile("./lang/active.id.json")

	return &LocalizerMiddleware{bundle: bundle}
}

// middleware localizer using Accept-Language in header
func (t *LocalizerMiddleware) Middleware() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		// get header accept language
		accept := ctx.GetHeader("Accept-Language")
		matcher := language.NewMatcher(t.bundle.LanguageTags())
		_, i, _ := matcher.Match(language.Make(accept))

		lang := t.bundle.LanguageTags()[i]
		localizer := i18n.NewLocalizer(t.bundle, lang.String())

		ctx.Set("localizer", localizer)
		ctx.Next()
	}
}
