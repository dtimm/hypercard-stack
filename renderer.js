// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const electron = require('electron');
let game = electron.remote.getGlobal('game');
if (game)
{
    let width = window.innerWidth;
    let height = window.innerHeight;
    let scale = 1;
    let currentViewName = game.map.GetStateMachine('player view').currentState;
    console.log(currentViewName);
    let view = game.map.GetView(currentViewName);
    let bg = document.getElementById('background');
    bg.src = view.background;
    let imageRatio = view.imageSize.width / view.imageSize.height;
    let windowRatio = width / height;
    if (imageRatio > windowRatio)
    {
        // Reduce the height proportionally
        scale = width / view.imageSize.width;
        bg.style.width = width + 'px';
        bg.style.height = Math.floor(scale * view.imageSize.height) + 'px';
    }
    else if (imageRatio < windowRatio)
    {
        // Reduce the width proportionally
        scale = height / view.imageSize.height;
        bg.style.height = height + 'px';
        bg.style.width = Math.floor(scale * view.imageSize.width) + 'px';
    }

    let viewContainer = document.getElementById('view-container');
    view.links.forEach(l => {
        let link = document.createElement('div');
        link.onclick = () => {
            game.map.GetStateMachine('player view').doTransition(l.transition);
            game.reRender();
        }
        link.className = 'link';
        link.style.borderStyle = 'dashed';
        link.style.borderWidth = '1px';
        link.style.borderColor = 'red';
        link.style.left = l.position[0] * scale + 'px';
        link.style.top = l.position[1] * scale +  'px';
        link.style.width = l.position[2] * scale + 'px';
        link.style.height = l.position[3] * scale + 'px';
        viewContainer.appendChild(link);
    });
    console.log(game.map.GetStateMachine('Lever 1 SM').currentState);
    view.controls.forEach(c => {
        let con = document.createElement('img');
        con.src = game.map.folderName + c.images.find(i => i['state'] === game.map.GetStateMachine(i['stateMachine']).currentState)['image'];
        con.onclick = () => {
            // TODO get player hand item for action.
            c.stateMachine.doTransition(c.actions['poke'])
            game.reRender();
        }
        con.className = 'control';
        con.style.borderStyle = 'dashed';
        con.style.borderWidth = '1px';
        con.style.borderColor = 'red';
        con.style.left = c.position[0] * scale + 'px';
        con.style.top = c.position[1] * scale +  'px';
        con.style.width = c.position[2] * scale + 'px';
        con.style.height = c.position[3] * scale + 'px';
        viewContainer.appendChild(con);
    });
}