window.onload = () => {
    localStorage.removeItem("source-credentials");
    localStorage.removeItem("target-credentials");
    localStorage.removeItem("source-flag-profiles");
    localStorage.removeItem("target-flag-profiles");
}

const wait = ms => new Promise(res => setTimeout(res, ms));


let migratingFlagProfiles = new Set();


function getCheckBoxEle(id) {
    let ele = `<div class="checkbox-wrapper-12 " style="margin: 0 11px;">
        <div class="cbx">
            <input id="${id}" type="checkbox" onclick="AddToList(event)" class="flag-checkbox"/>
            <label for="${id}"></label>
            <svg width="15" height="14" viewbox="0 0 15 14" fill="none">
                <path d="M2 8.36364L6.23077 12L13 2"></path>
            </svg>
        </div>
        <!-- Gooey-->
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
            <defs>
                <filter id="goo-12">
                    <fegaussianblur in="SourceGraphic" stddeviation="4" result="blur"></fegaussianblur>
                    <fecolormatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -7"
                        result="goo-12"></fecolormatrix>
                    <feblend in="SourceGraphic" in2="goo-12"></feblend>
                </filter>
            </defs>
        </svg>
    </div>`
    return ele;
}

function flagProfileEle(data, index, tenantType) {
    let ele = `
    <div class="accordion-item">
        <h2 class="accordion-header d-flex align-items-center">`;

    if (tenantType == "source") {
        ele += getCheckBoxEle(data["id"]);
    }

    ele += `<button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                data-bs-target="#collapse-${tenantType}-${index}" aria-expanded="false"
                aria-controls="collapse-${tenantType}-${index}">
                ${data["name"]}
            </button>
        </h2>
        <div id="collapse-${tenantType}-${index}" class="accordion-collapse collapse">
            <div class="accordion-body">
                <pre class="language-json" id="json-container" style="max-height: 300px; overflow-y: auto; white-space: pre-line;">
                    <code>${JSON.stringify(data, null, 4)}</code>
                </pre>
            </div>
        </div>
    </div>`;

    return ele;
}

function handleFileUpload(event) {
    const fileInput = event.target;
    const file = fileInput.files[0];

    return new Promise((resolve, reject) => {
        if (file) {
            const reader = new FileReader();

            reader.onload = function (e) {
                try {
                    const credentials = JSON.parse(e.target.result);
                    const fileName = file.name;
                    resolve({ credentials, fileName });
                } catch (error) {
                    reject('Error parsing JSON file: ' + error.message);
                }
            };

            reader.readAsText(file);
        } else {
            reject('No file selected');
        }
    });
}

function CheckTenants() {
    let sourceCredentials = localStorage.getItem('source-credentials');
    let targetCredentials = localStorage.getItem("target-credentials");
    if (sourceCredentials == null || targetCredentials == null) {
        return true
    } else {
        let source = JSON.parse(sourceCredentials);
        let target = JSON.parse(targetCredentials);

        if (source.customerId == target.customerId) {
            return false;
        }
        return true;
    }
}


function resetCheckBoxes() {
    document.querySelectorAll('.flag-checkbox').forEach(ele => {
        ele.checked = false;
    });
    migratingFlagProfiles = new Set();
}

async function getTargetFlagProfiles(credentials) {
    let accordianEle = document.getElementById('flag-profiles-target');

    accordianEle.innerHTML = `<div class="d-flex flex-column justify-content-center align-items-center">
    <div class="spinner-border text-info custom-spinner" role="status">
    <span class="visually-hidden">Loading Flag Profiles...</span>
  </div>
  <div class="fw-bold text-info lead">Loading...</div>
    </div>`;

    let response = await fetch('/api/getFlagProfiles', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
    });


    let data = await response.json();
    if (response.status == 200) {
        localStorage.setItem("target-flag-profiles", JSON.stringify(data));
        accordianEle.innerHTML = ''
        data.forEach((profile, count) => {
            ele = flagProfileEle(profile, count, "target");
            accordianEle.innerHTML += ele;
        })
        Prism.highlightAll();
    }
    else {
        accordianEle.innerHTML = "";
        document.getElementById('file-name-target').innerHTML = "No file chosen";
        localStorage.removeItem("target-credentials");
        localStorage.removeItem("target-flag-profiles");
        showSnakBar(data.message.detail);
    }
}



document.getElementById('source-file').addEventListener('input', async (event) => {

    migratingFlagProfiles = new Set();

    let { credentials, fileName } = await handleFileUpload(event);
    event.target.value = "";

    localStorage.setItem('source-credentials', JSON.stringify(credentials));

    let isValid = CheckTenants();

    if (!isValid) {
        localStorage.removeItem("source-credentials");
        showModal("Restricted", "Source and Target should be different");
        return
    }

    document.getElementById('file-name-source').innerHTML = fileName;

    let accordianEle = document.getElementById('flag-profiles-source');

    accordianEle.innerHTML = `<div class="d-flex flex-column justify-content-center align-items-center">
    <div class="spinner-border text-info custom-spinner" role="status">
    <span class="visually-hidden">Loading...</span>
  </div>
  <div class="fw-bold text-info lead">Loading Flag Profiles...</div>
    </div>`;

    let response = await fetch('/api/getFlagProfiles', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
    });


    let data = await response.json();
    if (response.status == 200) {
        localStorage.setItem("source-flag-profiles", JSON.stringify(data));
        accordianEle.innerHTML = ''
        data.forEach((profile, count) => {
            ele = flagProfileEle(profile, count, "source");
            accordianEle.innerHTML += ele;
        })
        Prism.highlightAll();
    }
    else {
        accordianEle.innerHTML = "";
        document.getElementById('file-name-source').innerHTML = "No file chosen";
        localStorage.removeItem("source-credentials");
        localStorage.removeItem("source-flag-profiles");
        showSnakBar(data.message.detail);
    }
    handleMigrateButton();
})



document.getElementById("target-file").addEventListener('change', async (event) => {
    migratingFlagProfiles = new Set()
    resetCheckBoxes();
    let { credentials, fileName } = await handleFileUpload(event);
    event.target.value = "";

    let tempCredentials = localStorage.getItem('target-credentials');

    localStorage.setItem('target-credentials', JSON.stringify(credentials));

    let isValid = CheckTenants();

    if (!isValid) {
        localStorage.setItem("target-credentials", tempCredentials);
        handleMigrateButton();
        showSnakBar("Source and Target should be different");
        return
    }
    document.getElementById("file-name-target").innerHTML = fileName;

    getTargetFlagProfiles(credentials);
    handleMigrateButton();
})

function handleMigrateButton() {
    let migrateButton = document.getElementById("migrate-button");
    let sourceFlagProfiles = localStorage.getItem('source-flag-profiles');
    let targetFlagProfiles = localStorage.getItem("target-flag-profiles");

    if (migratingFlagProfiles.size > 0 && sourceFlagProfiles != null && targetFlagProfiles != null) {
        migrateButton.disabled = false;
    }
    else {
        migrateButton.disabled = true;
    }
}

function findByKey(arr, key, value) {
    return arr.find(obj => obj[key] === value);
}


function AddToList(event) {
    let ele = event.currentTarget;
    let flagId = ele.id;
    if (ele.checked) {
        let sourceFlagProfiles = localStorage.getItem("source-flag-profiles");
        sourceFlagProfiles = JSON.parse(sourceFlagProfiles);

        let targetFlagProfiles = localStorage.getItem("target-flag-profiles");

        if (!targetFlagProfiles) {
            setTimeout(() => {
                ele.checked = false;
            }, 1000);
            return
        }

        targetFlagProfiles = JSON.parse(targetFlagProfiles);

        let currentFlagProfile = findByKey(sourceFlagProfiles, "id", flagId);

        let isNameExists = Boolean(findByKey(targetFlagProfiles, "name", currentFlagProfile.name));

        if (isNameExists) {
            showSnakBar("Flag Profile with this Name already present in the target tenant");
            ele.checked = false;
            return
        }
        let isPriorityExists = Boolean(findByKey(targetFlagProfiles, "priority", currentFlagProfile.priority));

        if (isPriorityExists) {
            showSnakBar("Same Priority Flag Profile already Exists in the target tenant");
            ele.checked = false;
            return
        }
        migratingFlagProfiles.add(ele.id);
    }
    else {
        migratingFlagProfiles.delete(ele.id);
    }
    handleMigrateButton();
}

function toggleMigrateButton(type, message) {

    let ele = document.getElementById("migrate-button");
    if (type == "loading") {
        ele.innerHTML = `<span class="spinner-border spinner-border-sm" aria-hidden="true"></span>
        <span role="status">Migrating...</span>`;
    } else if (type == "done") {
        ele.innerHTML = message;
        if (message == "Error") {
            ele.innerHTML += `<i class="bi bi-exclamation-octagon-fill ms-3 text-danger"></i>`
        }
        else {
            ele.innerHTML += `<i class="bi bi-patch-check-fill ms-3 text-success"></i>`
        }

    }
    else {
        ele.innerHTML = `Migrate <i
        class="bi bi-send-arrow-up"></i>`;
    }
}


document.getElementById("migrate-button").addEventListener("click", async () => {
    let targetCredentials = localStorage.getItem("target-credentials");
    let sourceFlagProfiles = localStorage.getItem("source-flag-profiles");
    sourceFlagProfiles = JSON.parse(sourceFlagProfiles);
    targetCredentials = JSON.parse(targetCredentials);

    toggleMigrateButton('loading', null);

    let profiles = sourceFlagProfiles.filter(profile => migratingFlagProfiles.has(profile.id));
    let keys = ["name", "description", "priority", "flags", "osFlags", "resourceType", "custom"];

    profiles = profiles.map((profile) => {
        let temp = {};
        keys.forEach(key => {
            temp[key] = profile[key];
        });

        return temp;
    });

    let payload = { "flagProfiles": profiles, "credentials": targetCredentials };

    let response = await fetch('/api/migrateFlagProfiles', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
    });

    // Handle Check Buttons and migrate button
    resetCheckBoxes();
    handleMigrateButton();

    let data = await response.json();

    if (response.status == 200) {
        toggleMigrateButton('done', "Success");
        await wait(2000);
        getTargetFlagProfiles(targetCredentials);
    }
    else {
        toggleMigrateButton('done', "Error");
        await wait(3000);
        showSnakBar("Error while migrating some of the flag profiles");
    }

    toggleMigrateButton('migration', null);
});



function showSnakBar(message) {
    var ele = document.getElementById("snackbar");
    ele.innerHTML = `<i class="bi bi-x-circle-fill" style="font-size: 21px;"></i> ${message}`;
    ele.className = "show";
    setTimeout(function(){ ele.className = ele.className.replace("show", ""); }, 4800);
  }