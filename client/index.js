import React, {Component,PureComponent} from 'react'
import ReactDOM from 'react-dom'
import { whyDidYouUpdate } from 'why-did-you-update'
whyDidYouUpdate(React)
require('./index.less')
let image = require('./placeholder.jpeg')
class LazyComponent extends React.Component {
    constructor(props) {
        super(props)
        this.imgSrc = image
        this.elementInViewport = this.elementInViewport.bind(this)
        this.supportsPassive = this.supportsPassive.bind(this)
        this.lazyLoad = this.lazyLoad.bind(this)
    }
    elementInViewport(el) {
        let rect = el.getBoundingClientRect()
        console.log(rect)
        console.log(`InnerHeight: ${window.innerHeight}`)
        console.log(`ClientHeight: ${document.documentElement.clientHeight}`)
        return (
            (rect.height > 0 || rect.width > 0) &&
            rect.bottom >= 0 &&
            rect.right >= 0 &&
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.left <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
    supportsPassive() {
        let supportsPassive = false
        try {
            let opts = Object.defineProperty({}, 'passive', {
                get: function () {
                    supportsPassive = true;
                }
            })
            window.addEventListener("test", null, opts)
            return supportsPassive
        } catch (e) { }
    }
    componentWillMount() {
        console.log(this.imgSrc)
    }
    componentDidMount() {
        let imgComponent = this.refs.img
        console.log(this.elementInViewport(imgComponent))
        document.addEventListener('scroll', this.lazyLoad, this.supportsPassive() ? { passive : true } : false)
    }
    componentWillUnmount(){
        document.removeEventListener('scroll',this.lazyLoad)
    }
    lazyLoad(){

    }
    render() {
        return (<img ref='img' src={this.imgSrc}/>)
    }
}

class RippleElement extends Component{
	render(){
		return (<div className='ripple-element'/>)
	}
}

class App extends PureComponent {
	constructor(props){
		super(props)
		this.state = {name:'Gurudatt'}
		this.updateState = this.updateState.bind(this)
		this.createRipple = this.createRipple.bind(this)
	}
	updateState(e){
		this.createRipple(e,e.target,'#444','0.3s',false)
		this.setState({
			name:'Hello'
		})
	}
	createRipple(event, targetElement, color, delay, boolVal,callback){
		let boundingRect = targetElement.getBoundingClientRect(),
		leftOffset = boundingRect.left + window.pageXOffset - document.documentElement.clientLeft,
		topOffset = boundingRect.top + document.body.scrollTop - document.body.clientTop,
		width = boundingRect.right - boundingRect.left,
		height = boundingRect.bottom - boundingRect.top,
		rippleElement = targetElement.querySelector('.ripple-element')

		rippleElement && rippleElement.parentNode.removeChild(rippleElement)

		rippleElement = document.createElement('div')
		rippleElement.classList.add('ripple-element')
		color && (rippleElement.style.background = color)
		delay && (rippleElement.style.animationDuration = delay)
		targetElement.appendChild(rippleElement)
		let rippleSpread = Math.max(width,height)
		rippleElement.style.width = `${rippleSpread}px`
		rippleElement.style.height = `${rippleSpread}px`
		rippleElement.style.borderRadius = '100%'
		boolVal ? (rippleElement.style.left = `${width/2 - rippleSpread/2}px`, rippleElement.style.top = `${height/2 - rippleSpread/2}px`) :
				(rippleElement.style.left = `${event.pageX - leftOffset - rippleSpread/2}px`, rippleElement.style.top = `${event.pageY - topOffset - rippleSpread/2}px` )
		window.requestAnimationFrame(function(){
			rippleElement.classList.add('_animate')
		})
		rippleElement.addEventListener('animationend',function(){
			rippleElement && rippleElement.parentNode && rippleElement.parentNode.removeChild(rippleElement)
			callback && callback.call(null)
		})
	}
    render() {
        return (
            <div>
				<div onClick={this.updateState} style={{width:'60px'}}>{'Update State'}</div>
			</div>
        )
    }
}

ReactDOM.render(<App/>, document.getElementById('app'))
