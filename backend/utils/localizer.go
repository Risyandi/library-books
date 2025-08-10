package utils

import (
	"encoding/json"

	"github.com/gin-gonic/gin"
	"github.com/nicksnyder/go-i18n/v2/i18n"
	"golang.org/x/text/language"
)

func GetLocalizer(lang string) *i18n.Localizer {
	// default language for localizer

	// expected: No need to load active.en.toml since we are providing default translations.
	// reality: when comments "bundle.MustLoadMessageFile("./lang/active.en.toml")" got the error because func not to call
	bundle := i18n.NewBundle(language.English)

	// register file json for localizer language
	bundle.RegisterUnmarshalFunc("json", json.Unmarshal)
	bundle.MustLoadMessageFile("./lang/active.en.json")
	bundle.MustLoadMessageFile("./lang/active.id.json")
	return i18n.NewLocalizer(bundle, lang)
}

// handle localize string with default message
func LocalizeString(localizer *i18n.Localizer, messageID string, templateData map[string]interface{}) string {
	return localizer.MustLocalize(&i18n.LocalizeConfig{
		DefaultMessage: &i18n.Message{
			ID: messageID,
		},
		TemplateData: templateData,
	})
}

// handle localize string with plural message
func LocalizePluralString(localizer *i18n.Localizer, messageID string, pluralCount int64, templateData map[string]interface{}) string {
	return localizer.MustLocalize(&i18n.LocalizeConfig{
		DefaultMessage: &i18n.Message{
			ID: messageID,
		},
		PluralCount:  pluralCount,
		TemplateData: templateData,
	})
}

// handle localize vie header accept language
func LocalizeStringMessage(ctx *gin.Context, messageID string) string {
	localizer := ctx.MustGet("localizer").(*i18n.Localizer)
	message, err := localizer.Localize(&i18n.LocalizeConfig{
		MessageID: messageID,
	})

	if err != nil {
		return messageID
	}

	return message
}
