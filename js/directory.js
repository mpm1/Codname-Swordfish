class Directory {
    drive = null;
    console = null;

    constructor( console) {
        this.mainFolderName = mainFolderName;
        this.console = console;
    }

    async initialize(googleDrive, mainFolderName, fileList) {
        this.drive = googleDrive;

        const fileMainDirectory = await this.openOrCreateDirectory(mainFolderName);
        
        const fileData = Promise.all(fileList.map(file => {
            fileMetadata = await this.openOrCreateFile(file.name, file.mimeType, fileMainDirectory.id, file.oncreate);
            if (file.oncreate) {
                file.oncreate(fileMetadata);
            };
        }));

        return {
            directory: fileMainDirectory,
            files: fileData
        };
    }

    async listFilesByName(name, mimeType) {
        var query = `name contains '${name}'`;

        if (mimeType) {
            query += ` and mimeType = '${mimeType}'`;
        }
        
        try {
            const fileList = await this.drive.files.list({
                q: query,
                spaces: "drive"
            });

            return fileList.result.files;
        } catch (error) {
            this.console.error(`Error finding folder ${name}.`, error);

            throw error;
        }
    }

    async createDirectory(name) {
        this.console.writeLine(`Creating directory ${name}...`);

        const fileMetadata = {
            'name': name,
            'mimeType': "application/vnd.google-apps.folder",
            'folderColorRgb': "#00FF00"
        };

        try{
            const file = await this.drive.files.create(fileMetadata);

            return {
                name: name,
                id: file.id
            }
        } catch(error) {
            this.console.error(`Error creating directory ${name}.`, error);

            throw error;
        }
    }

    async createBlankFile(name, mimeType) {
        this.console.writeLine(`Creating file ${name}...`);

        const fileMetadata = {
            'name': name,
            'mimeType': mimeType
        };

        try{
            const file = await this.drive.files.create(fileMetadata);

            return {
                name: name,
                id: file.id
            }
        } catch(error) {
            this.console.error(`Error creating file ${name}.`, error);

            throw error;
        }
    }

    async openOrCreateDirectory(name) {
        this.console.writeLine("Validating data path...");

        try {
            const folderList = await this.listFilesByName(name, "application/vnd.google-apps.folder");

            for (const file of folderList) {
                if (file.name === name) {
                    this.console.writeLine("Path found.");

                    return {
                        name: file.name,
                        id: file.id
                    }
                }
            }

            this.console.writeLine("No path found.");
            return await this.createDirectory(name);
        } catch (error) {
            this.console.error("Aborting validation.");

            throw error;
        }
    }

    async openOrCreateFile(name, mimeType, parentFolderId) {
        this.console.writeLine(`Validating file ${name}...`);

        try {
            const folderList = await this.listFilesByName(name, true);

            for (const file of folderList) {
                if (file.name === name) {
                    this.console.writeLine("Path found.");

                    return {
                        name: file.name,
                        id: file.id
                    }
                }
            }

            this.console.writeLine("No path found.");
            return await this.createDirectory(name);
        } catch (error) {
            this.console.error("Aborting validation.");

            throw error;
        }
    }
}