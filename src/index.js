const { app, BrowserWindow, Menu , ipcMain} = require('electron')
const url = require('url');
const path = require('path');
const { networkInterfaces } = require('os');

if(process.env.NODE_ENV !== 'production'){

    require('electron-reload')(__dirname, {
        electron:path.join(__dirname, '../node_modules','.bin','electron')
    });
}

let mainwindow
let newproductwindow

app.on('ready', () =>{ 

    mainwindow = new BrowserWindow({});
    mainwindow.loadURL(url.format({
        pathname: path.join(__dirname, 'views/index.html'),
        protocol: 'file',
        slashes: true
    }))

    const mainMenu = Menu.buildFromTemplate(templateMenu);
    Menu.setApplicationMenu(mainMenu);

    mainwindow.on('closed', () =>{ app.quit(); });
});


function createnewproductwindow(){
   newproductwindow = new BrowserWindow ({
        width: 400,
        height: 330,
        title: 'ADD NEW PRODUCT'
    });
  //  newproductwindow.setMenu(null);
    newproductwindow.loadURL(url.format({
        pathname: path.join(__dirname, 'views/products.html'),
        protocol: 'file',
        slashes: true
    }));

    newproductwindow.on('closed', () => {
        newproductwindow = null;
    });
  
}



ipcMain.on('product:new', (e, new_product) =>{
    mainwindow.webContents.send('product:new', new_product);
    newproductwindow.closed
});

const templateMenu = [
        {
            label: 'FILE',
            submenu: [
                {
                    label: 'NEW PRODUCT',
                    accelerator:'Ctrl+N' , 
                    click(){
                        createnewproductwindow()
                    }
                },
                {
                    label: 'REMOVE ALL PRODUCTS',
                    click(){
                        mainwindow.webContents.send('products:remove-all');
                    }
                },
                {
                    label: 'EXIT',
                    accelerator: 'Ctrl+Q',
                    click(){
                        app.quit();
                    }
                }
            ]
        },
       
    ];

    if(process.platform === 'darwin'){
        templateMenu.unshift({
            label:app.getName()
        });
    }

    if(process.env.NODE_ENV !== 'production'){
        templateMenu.push({
            label:'DEVTOOL',
            submenu:[
                {
                    label: 'SHOW/HIDE',
                    accelerator: 'Ctrl+D',
                    click(item, focusedWindow){
                        focusedWindow.toggleDevTools();
                    }
                },
                {
                    role: 'reload'
                }
            ]
        })
    }


