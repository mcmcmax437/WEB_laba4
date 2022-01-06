export default class WorkTransform{

    constructor(parent, output, data) {
        this.parent = parent
        this.output = output
        this.data = data
        this.iter = 0
    }

    _iniObject(){
        const controls = document.createElement("div")
        controls.className = "controls"
        const status = document.createElement("span")
        status.innerHTML = this.data.begin
        this.status = status
        const start = document.createElement("button")
        const close = document.createElement("button")
        const stop = document.createElement("button")
        const reload = document.createElement("button")
        this.close = close
        close.innerHTML = this.data.close
        start.innerHTML = this.data.start
        stop.innerHTML = this.data.stop
        reload.innerHTML = this.data.reload
        controls.append(status,start,stop,reload,close)        
        this.start = start
        this.stop = stop
        this.reload = reload
        const work =  document.createElement("div")
        work.addEventListener("click", (e) => e.stopPropagation())
        work.className = "work"
        const canvas = document.createElement("div")
        canvas.className = "canvas"
        this.canvas = canvas
        const square1 = document.createElement("div")
        square1.className = "square1"
        const square2 = document.createElement("div")
        square2.className = "square2"
        work.append(controls,canvas)
        this.canvas.append(square1,square2)
        this.square1 = square1
        this.square2 = square2
        return work
    }

    mount(){
        this.parent.appendChild(this._iniObject())
        this.x = [this.canvas.scrollWidth / 2, 0]
        this.deg = [Math.random()*5 + 5, Math.random()*5 + 5]
        this.y = [0,this.canvas.scrollHeight / 2]
        this.direction = [[],[]]
        this.direction[0].push(Math.random() > 0.5 ? 1 : -1)
        this.direction[0].push(1)
        this.direction[1].push(-1)
        this.direction[1].push(Math.random() > 0.5 ? 1 : -1)
        this.start.addEventListener("click", this._start)
        this.stop.addEventListener("click", this._stop)
        this.reload.addEventListener("click", this._reload)
        this.close.addEventListener("click", () => {
            this._unmount()
        })
        window.addEventListener("resize", () => {
            this.canvas.width = this.parent.width
        })
        localStorage.setItem("record","")
        this.start.style.display = "inline-block"
        
    }

    _setStatus(title) {
        this.status.innerHTML = title
        const date = new Date()
        let record = `${title}=>${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}\n`
        localStorage.setItem("record", localStorage.getItem("record") + record)
    }

    _unmount() {
        this.parent.removeChild(this.parent.querySelector(".work"))
        const span = document.createElement("span")
        span.className = "Record"
        span.innerHTML = localStorage.getItem("record")
        this.output.appendChild(span)
    }

    _start = (e) => {
        this._beginAnim()
        this.canvas.opacity = 1
        this.start.style.display = "none"
        this.stop.style.display = "inline-block"
        this._setStatus(this.data.start)
    }

    _beginAnim() {
        this.square1.style.display = "flex"
        this.square2.style.display = "flex"
        this.anim = setInterval(this._action, 1000/this.data.speed)
    }

    _action = () => {
        this.canvas.width = this.canvas.scrollWidth
        this.canvas.height = this.canvas.scrollHeight
        this.square1.style.transform = `translate(${this.x[0]}px,${this.y[0]}px)`
        this.square2.style.transform = `translate(${this.x[1]}px,${this.y[1] - 10}px)`
        console.log(this.x,this.y)

        if((this.x[0] - this.x[1]<=10) && (this.y[0] - this.y[1]<=10) && (this.x[0] - this.x[1]>=0) && (this.y[0] - this.y[1]>=0)) {
            clearInterval(this.anim)
            this.square1.style.transform = `translate(${this.x[0]}px,${this.y[0]}px)`
            this.square2.style.transform = `translate(${this.x[1]}px,${this.y[1] - 10}px)`
            this.reload.style.display="inline-block"
            this.stop.style.display="none"
            this._setStatus(this.data.end)
        }
       
        for(let i = 0; i <this.x.length; i++) {
            if(this.iter%2==1 && i == 1) {
                break
            }
            if(this.x[i] + 1 * this.deg[i] + 10 * (i+1) > this.canvas.clientWidth-10 && this.direction[i][0] == 1) {
                this.direction[i][0] *= -1
                this.y[i] += (this.x[i] - (this.canvas.clientWidth - 10 * (i+1))) / this.deg[1] * this.direction[i][1]
                this.x[i] = this.canvas.clientWidth - 10 * (i+1)
                this._setStatus(this.data.right)
            } else if (this.x[i] - 1 * this.deg[i] < 0 && this.direction[i][0] == -1){
                this.y[i] += this.x[i] / this.deg[i] * this.direction[i][1]
                this.x[i] = 0
                this.direction[i][0] *= -1
                this._setStatus(this.data.left)
            } else if(this.y[i] + 10*(i+1) > this.canvas.clientHeight && this.direction[i][1] == 1) {
                this.direction[i][1] = -1
                this.y[i] = this.canvas.clientHeight - 10 * (i+1) - 5
                this._setStatus(this.data.bottom)
            } else if(this.y[i] <= 0 && this.direction[i][1] == -1) {
                this.direction[i][1] = 1
                this.y[i] = 1
                this.x[i] += this.deg[i]
                this._setStatus(this.data.top)
            }else {
                this.y[i]+=this.direction[i][1]
                this.x[i] += 1 * this.deg[i] * this.direction[i][0] 
            }
        }
        this.iter++ 
        
    }
    
    _stop = () => {
        this.start.style.display = "inline-block"
        this.stop.style.display = "none"
        this._setStatus(this.data.stop)
        clearInterval(this.anim)
    }

    _reload = () => {
        this.reload.style.display = "none"
        this.stop.style.display = "inline-block"
        this.x = [this.canvas.scrollWidth / 2, 0]
        this.deg = [Math.random()*5 + 5, Math.random()*5 + 5]
        this.y = [0,this.canvas.scrollHeight/2,0]
        this.direction = [[],[]]
        this.direction[0].push(Math.random() > 0.5 ? 1 : -1)
        this.direction[0].push(1)
        this.direction[1].push(-1)
        this.direction[1].push(Math.random() > 0.5 ? 1 : -1)
        this._setStatus(this.data.reload)
        this._beginAnim()
    }
}