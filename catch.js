let nodeList = [];

let alreadyCreated = (tabList, message) => {
  for (let i = 0; i < tabList.children.length; i++) {
    let childId = tabList.children[i].getAttribute('data-id')
    if (childId == message.tab.id) {
      return true;
    }
  }
  return false;
}

const createFav = (tab) => {
  let fav = document.createElement('img');
  fav.classList.add('item-img');
  fav.setAttribute('src', tab.favIconUrl);
  return fav;
}

const createSpan = (tab) => {
  let spn = document.createElement('span');
  spn.innerHTML = tab.title;
  spn.classList.add('item-text');
  return spn;
}

const createListItem = (tab) => {
  let listItem = document.createElement('li');
  listItem.setAttribute('data-id', tab.id);
  listItem.setAttribute('data-url', tab.url);
  listItem.classList.add('overflow-item');
  listItem.appendChild(createFav(tab));
  listItem.appendChild(createSpan(tab));
  listItem.addEventListener('click', () => {
    listItem.remove();
    chrome.runtime.sendMessage({type: "OPEN_TAB", url: tab.url})
  });
  return listItem;
}

const firstGreater = (fav, domList) => {
  for (let i = 0; i < domList.length; i++) {
    let otherFav = domList[i].firstChild.getAttribute('src')
    if (fav < otherFav) {
      return i;
    }
  }
}

const customAppend = (tabList, listItem) => {
  let domList = document.querySelectorAll('li')
  let fav = listItem.firstChild.getAttribute('src');
  let insertionIdx;
  insertionIdx = firstGreater(fav, domList)
  if (insertionIdx) {
    tabList.insertBefore(listItem, domList[insertionIdx])
  } else {
    tabList.appendChild(listItem)
  }
}

chrome.runtime.onMessage.addListener((message) => {
  switch (message.type) {
    case "SEND_TAB":
      let tabList = document.getElementById("overflow-list");
      if (!alreadyCreated(tabList, message)) {
        let listItem = createListItem(message.tab);
        nodeList.push(listItem);

        customAppend(tabList, listItem)
      }
      return true;
      break;
      case "FETCH_TAB":
        selId = nodeList.shift().getAttribute('data-id')
        selItem = document.querySelector(`[data-id="${selId}"]`)
        let url = selItem.getAttribute('data-url');
        chrome.runtime.sendMessage({type: "OPEN_TAB", url: url});
        selItem.remove();
        if (li.length === 0) {
          chrome.runtime.sendMessage({type: "DESTROY_OVERFLOW"})
        }
        break;
    default:
      return true;
  }
})

document.addEventListener("DOMContentLoaded", () => {
  chrome.runtime.sendMessage({type: "REQUEST_PURGATORY"})
})
