function render(reactElement, container) {
    const elements = document.createElement
    (reactElement.type)
    elements.innerHTML = reactElement.children
    elements.setAttribute('href', reactElement.props.href)
    elements.setAttribute('target',reactElement.props.target)

    container.appendChild(elements)
}

const reactElement = {
     type:'a',
     props: {
        href: 'https://google.com',
        target:'_blank',
     }, children:'Click Here'
}
const mainContainer = document.querySelector('#root')
 render(reactElement, mainContainer)