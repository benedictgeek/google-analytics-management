type TagTypes = string | string[];

const appendTags = (tags: TagTypes) => {
  if (tags == null) return "";

  let googleTags: string[] = [];

  if (typeof tags === "string") {
    googleTags.push(tags);
  } else if (Array.isArray(tags)) {
    googleTags = [...googleTags, ...tags];
  }

  let scriptTagString = "";

  for (let index = 0; index < googleTags.length; index++) {
    const googleTag = googleTags[index];

    const tagSections = googleTag.trim().split("-");

    //a google analytics tag should have two sections, e.g G-12WERY or UA-ASDFWER
    if (tagSections.length < 2) continue;

    const tagIdentifyer = tagSections[0].trim().toLowerCase();

    const trimmedGoogleTag = (
      tagIdentifyer +
      "-" +
      tagSections[1].trim()
    ).toUpperCase();

    //implement GTM tag flow
    if (tagIdentifyer == "gtm") {
      scriptTagString =
        scriptTagString +
        `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${trimmedGoogleTag}'); \n\n`;

      //append iframe code just under the opening body element

      let node = window?.document?.createElement("noscript");
      let iframe = document?.createElement("iframe");
      iframe.src = `https://www.googletagmanager.com/ns.html?id=${trimmedGoogleTag}`;
      iframe.height = "0";
      iframe.width = "0";
      iframe.setAttribute("display", "none");
      iframe.setAttribute("visibility", "hidden");
      node.appendChild(iframe);

      //ensure duplicates iframes are not allowed
      if (
        window?.document.querySelector(
          `noscript iframe[src='${iframe.src}']`
        ) == null
      )
        window?.document?.body.prepend(node);
    } else {
      //for direct tag management without containers
      scriptTagString =
        scriptTagString + `gtag('config', '${trimmedGoogleTag}'); \n\n`;
    }
  }

  //append the head script
  if (scriptTagString.length > 0) {
    let scriptNode = window?.document?.createElement("script");
    scriptNode.innerHTML =
      `window.dataLayer = window.dataLayer || []; \n
    function gtag(){dataLayer.push(arguments);} \n
    gtag('js', new Date()); \n` + scriptTagString;

    window.document.head.prepend(scriptNode);
  }
};
