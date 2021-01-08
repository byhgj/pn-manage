module.exports = {
    "route": [
        [
            "^(.*?)://(.*)",
            "$1:$2"
        ],
        [
            "^(md5|sha1|sha256|sha512)/(.*)",
            "code:hash/$1/$2"
        ],
		[
			"^(aaencode|jjencode|xxencode|uuencode|mime|morse|rot5|rot13|rot18|rot47|base64|base32|base16)/(encode|decode)/(.*)",
			"code:$1/$2/$3"
		],
        [
            "^(code):(.*?)/(.*?)/(.*)",
            "$1:$2/$3?$4"
        ],
        [
            "^(.*?):(.*?)/(.*?)\\?([^=]+)$",
            "$1:$2/$3?text=$4"
        ]
    ],
	"plugins": {
		"Template": "./plugin/template",
		"show": "./plugin/show"
	}
}