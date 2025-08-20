let parentUrl;

function setParentUrl(parent_url) {
  parentUrl = window.location == window.parent.location ? "" : parent_url;
}

function establishCommsWithUI(doc) {
  if (parentUrl) {
    console.log("adding listeners (AUTHOR_IDE)");
    window.addEventListener("message", (event) => {
      if (event.origin != parentUrl) return;
      if (event && event.data) {
        const type = event.data.type;
        switch (type) {
          case "update_theme":
            if (event.data.color == "light") {
              localStorage.setItem("theme", "default");
              doc.setTheme("default");
              doc.setEditorTheme("default");
              doc.setPreviewTheme("default");
            } else {
              localStorage.setItem("theme", "dark");
              doc.setTheme("dark");
              doc.setEditorTheme("pastel-on-dark");
              doc.setPreviewTheme("dark");
            }
            $(".page-divider").css(
              "background",
              doc.previewContainer.css("background-color")
            );
            break;
        }
      }
    });
  }
}

function requestToUI(data) {
  if (parentUrl) {
    console.log(`sending request to UI (FROM: Author IDE)`);
    try {
      console.log("content", data.text);
      parent.postMessage(data, parentUrl);
    } catch (e) {
      console.log(e);
    }
  }
}

function launchApplication(port, route, display) {
  if (parentUrl) {
    console.log("launching application");
    try {
      let message = {
        type: "launch_application",
        port: port,
        viewType: display,
        route: route,
      };
      window.parent.postMessage(message, parentUrl);
    } catch (e) {
      console.log(e);
    }
  }
}

function openFile(path) {
  if (parentUrl) {
    console.log("opening file in IDE");
    try {
      let message = { type: "open_file", uri: path };
      window.parent.postMessage(message, parentUrl);
    } catch (e) {
      console.log(e);
    }
  }
}

function openReward(rewardsLaunchURL) {
  if (parentUrl) {
    const urlParams = new URLSearchParams(window.location.search);
    const jwtToken = urlParams.get("token");

    fetch("/v2/reward/oauth", {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        Authorization: "Bearer " + jwtToken,
        "Content-Type": "application/json",
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
    })
      .then((response) => {
        if (response.status == 400) throw new Error("Something went wrong");
        return response.json();
      })
      .then((response) => {
        const form = document.createElement("form");
        form.setAttribute("method", "POST");
        form.setAttribute("action", rewardsLaunchURL);
        form.setAttribute("target", "_blank");
        form.setAttribute("id", "ltiform");
        for (var key in response["data"]) {
          if (response["data"].hasOwnProperty(key)) {
            var hiddenField = document.createElement("input");
            hiddenField.setAttribute("type", "hidden");
            hiddenField.setAttribute("name", key);
            hiddenField.setAttribute("value", response["data"][key]);
            form.appendChild(hiddenField);
          }
        }

        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

function openDataBase(db, start) {
  if (parentUrl) {
    console.log("opening db page in IDE");
    try {
      let message = { type: "open_db_page", db, start };
      window.parent.postMessage(message, parentUrl);
    } catch (e) {
      console.log(e);
    }
  }
}

function openBigData(tool, start) {
  if (parentUrl) {
    console.log("opening big data page in IDE");
    try {
      let message = { type: "open_big_data_page", tool, start };
      window.parent.postMessage(message, parentUrl);
    } catch (e) {
      console.log(e);
    }
  }
}

function openCloud(tool, action) {
  if (parentUrl) {
    console.log("opening cloud page in IDE");
    try {
      let message = { type: "open_cloud_page", tool, action };
      window.parent.postMessage(message, parentUrl);
    } catch (e) {
      console.log(e);
    }
  }
}

function openEmbeddableAI(tool, action) {
  if (parentUrl) {
    console.log("opening embeddable_ai page in IDE");
    try {
      let message = { type: "open_embeddable_ai_page", tool, action };
      window.parent.postMessage(message, parentUrl);
    } catch (e) {
      console.log(e);
    }
  }
}
