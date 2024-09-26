const parseInputFileData = async (file) => {
    return new Promise((resolve, reject) => {
        if (file) {
            const reader = new FileReader();

            reader.onload = function (e) {
                try {
                    const data = e.target.result;
                    const fileName = file.name;
                    resolve({ data, fileName });
                } catch (error) {
                    reject('Error while parsing the provided file');
                }
            };

            reader.readAsText(file);
        } else {
            reject('No file selected');
        }
    });
}


export default parseInputFileData