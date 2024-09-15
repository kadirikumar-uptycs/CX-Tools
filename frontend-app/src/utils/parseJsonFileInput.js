const parseInputFileData = async (event) => {
    const fileInput = event.currentTarget;
    const file = fileInput.files[0];

    return new Promise((resolve, reject) => {
        if (file) {
            const reader = new FileReader();

            reader.onload = function (e) {
                try {
                    const data = JSON.parse(e.target.result);
                    const fileName = file.name;
                    resolve({ data, fileName });
                } catch (error) {
                    reject('Error while parsing, provide JSON file');
                }
            };

            reader.readAsText(file);
        } else {
            reject('No file selected');
        }
    });
}


export default parseInputFileData