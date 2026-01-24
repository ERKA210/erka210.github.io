(()=>{var R=class extends HTMLElement{connectedCallback(){this.render=this.render.bind(this),this.updateActive=this.updateActive.bind(this),this.handleDocClick=this.handleDocClick.bind(this),this.handleUserUpdated=this.handleUserUpdated.bind(this),this.handleAppStateChanged=this.handleAppStateChanged.bind(this),this.loadUser=this.loadUser.bind(this),this.scheduleIdle=this.scheduleIdle?.bind(this)||(e=>{typeof window.requestIdleCallback=="function"?window.requestIdleCallback(()=>e(),{timeout:1200}):setTimeout(e,300)}),this.render(),window.addEventListener("hashchange",this.updateActive),window.addEventListener("user-updated",this.handleUserUpdated),window.addEventListener("app-state-changed",this.handleAppStateChanged),this.scheduleIdle(this.loadUser),this.updateActive()}disconnectedCallback(){window.removeEventListener("hashchange",this.updateActive),window.removeEventListener("user-updated",this.handleUserUpdated),window.removeEventListener("app-state-changed",this.handleAppStateChanged),document.removeEventListener("click",this.handleDocClick)}getAppState(){let e=localStorage.getItem("appState");if(e==="customer"||e==="courier")return e;let t=localStorage.getItem("authRole");return t==="customer"||t==="courier"?t:"guest"}getNavLinks(){let e=this.getAppState(),t=[];return e==="customer"&&(t.push({href:"#home",label:"\u041D\u04AF\u04AF\u0440",icon:"home"}),t.push({href:"#orders",label:"\u0417\u0430\u0445\u0438\u0430\u043B\u0433\u0430",icon:"orders"})),e==="courier"&&(t.push({href:"#home",label:"\u041D\u04AF\u04AF\u0440",icon:"home"}),t.push({href:"#delivery",label:"\u0425\u04AF\u0440\u0433\u044D\u043B\u0442",icon:"delivery"})),e!=="guest"&&t.push({href:"#profile",label:"\u041F\u0440\u043E\u0444\u0430\u0439\u043B",icon:"profile"}),t}renderNavLinks(){return this.getNavLinks().map(t=>`
      <a href="${t.href}">
        ${this.getIcon(t.icon)}
        <span>${t.label}</span>
      </a>
    `).join("")}getIcon(e){switch(e){case"orders":return`
          <svg width="27" height="28" viewBox="0 0 27 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path opacity="0.4" d="M8.26012 21.9703C9.1827 21.9703 9.93865 22.7536 9.93883 23.7213C9.93883 24.6776 9.18281 25.4615 8.26012 25.4615C7.32644 25.4613 6.57066 24.6775 6.57066 23.7213C6.57084 22.7537 7.32655 21.9704 8.26012 21.9703ZM20.767 21.9703C21.6894 21.9704 22.4455 22.7536 22.4457 23.7213C22.4457 24.6775 21.6896 25.4614 20.767 25.4615C19.8331 25.4615 19.0765 24.6776 19.0765 23.7213C19.0767 22.7536 19.8333 21.9703 20.767 21.9703Z" fill="#B8BABF"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M22.4456 7.31518C23.1237 7.31518 23.5684 7.55713 24.0131 8.08714C24.4577 8.61714 24.5356 9.37757 24.4355 10.0677L23.3794 17.626C23.1793 19.0789 21.9787 20.1493 20.5669 20.1493H8.4385C6.95997 20.1493 5.73713 18.9741 5.61485 17.4543L4.5921 4.89445L2.91348 4.59489C2.46881 4.51423 2.15754 4.06488 2.23535 3.60401C2.31317 3.13162 2.74672 2.82053 3.20251 2.88966L5.85386 3.30445C6.23182 3.37473 6.50974 3.69619 6.54309 4.08793L6.75431 6.66881C6.78766 7.03865 7.0767 7.31518 7.43243 7.31518H22.4456ZM15.7089 13.3053H18.7882C19.2551 13.3053 19.622 12.9136 19.622 12.4412C19.622 11.9573 19.2551 11.5771 18.7882 11.5771H15.7089C15.242 11.5771 14.8751 11.9573 14.8751 12.4412C14.8751 12.9136 15.242 13.3053 15.7089 13.3053Z" fill="#B8BABF"/>
          </svg>
        `;case"delivery":return`
          <svg width="32" height="28" viewBox="0 0 32 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M23.4385 0C23.7214 0 23.9933 0.132431 24.1934 0.368164C24.3933 0.603844 24.5058 0.923595 24.5059 1.25684V3.77051H27.7051C27.9137 3.77053 28.1178 3.84327 28.292 3.97852C28.4662 4.11392 28.6033 4.30714 28.6855 4.5332L31.8857 13.332C31.9426 13.4884 31.9716 13.657 31.9717 13.8271V22.626C31.9717 22.9594 31.8592 23.2789 31.6592 23.5146C31.4592 23.7503 31.1881 23.8828 30.9053 23.8828H28.6201C28.3881 24.9616 27.8576 25.9191 27.1123 26.6025C26.3672 27.2857 25.4499 27.6561 24.5059 27.6562C23.5616 27.6562 22.6437 27.2859 21.8984 26.6025C21.1531 25.9191 20.6227 24.9616 20.3906 23.8828H13.6875C13.4279 25.0676 12.8105 26.1003 11.9512 26.7871C11.0917 27.4739 10.0487 27.7685 9.01855 27.6143C7.98863 27.46 7.04187 26.8681 6.35547 25.9502C5.66899 25.0319 5.29004 23.8498 5.29004 22.626C5.29004 21.4022 5.66899 20.22 6.35547 19.3018C7.04187 18.3838 7.98864 17.7919 9.01855 17.6377C10.0487 17.4835 11.0917 17.778 11.9512 18.4648C12.8105 19.1517 13.4279 20.1843 13.6875 21.3691H20.3906C20.533 20.7285 20.781 20.1268 21.1211 19.5996C21.4612 19.0725 21.8864 18.6299 22.3721 18.2969V2.51367H6.37207V0H23.4385Z" fill="#C4C4C4"/>
          </svg>
        `;case"profile":return`
          <svg width="27" height="28" viewBox="0 0 27 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.3403 17.4831C18.1633 17.4831 22.2338 18.2955 22.2338 21.4294C22.2338 24.5644 18.1366 25.3483 13.3403 25.3483C8.51842 25.3483 4.44703 24.5357 4.44672 21.402C4.44672 18.2669 8.54382 17.4831 13.3403 17.4831ZM13.3403 2.30438C16.6075 2.30447 19.225 5.01714 19.225 8.40106C19.2248 11.7848 16.6074 14.4977 13.3403 14.4977C10.0742 14.4977 7.45476 11.7848 7.45453 8.40106C7.45453 5.01708 10.0741 2.30438 13.3403 2.30438Z" fill="#B8BABF"/>
          </svg>
        `;default:return`
          <svg width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M26.0821 10.6965L14.9138 0.573094C14.9084 0.568518 14.9032 0.563588 14.8985 0.55834C14.4873 0.199078 13.9515 0 13.3956 0C12.8398 0 12.304 0.199078 11.8928 0.55834L11.8775 0.573094L0.72175 10.6965C0.494193 10.8975 0.31255 11.1417 0.188313 11.4137C0.0640769 11.6856 -4.69666e-05 11.9794 2.58096e-08 12.2764V24.6758C2.58096e-08 25.2449 0.235331 25.7907 0.654222 26.1932C1.07311 26.5956 1.64125 26.8217 2.23366 26.8217H8.93462C9.52702 26.8217 10.0952 26.5956 10.5141 26.1932C10.9329 25.7907 11.1683 25.2449 11.1683 24.6758V18.238H15.6356V24.6758C15.6356 25.2449 15.8709 25.7907 16.2898 26.1932C16.7087 26.5956 17.2768 26.8217 17.8692 26.8217H24.5702C25.1626 26.8217 25.7307 26.5956 26.1496 26.1932C26.5685 25.7907 26.8039 25.2449 26.8039 24.6758V12.2764C26.8039 11.9794 26.7398 11.6856 26.6156 11.4137C26.4913 11.1417 26.3097 10.8975 26.0821 10.6965ZM24.5702 24.6758H17.8692V18.238C17.8692 17.6689 17.6339 17.1231 17.215 16.7206C16.7961 16.3182 16.228 16.0921 15.6356 16.0921H11.1683C10.5759 16.0921 10.0077 16.3182 9.58884 16.7206C9.16995 17.1231 8.93462 17.6689 8.93462 18.238V24.6758H2.23366V12.2764L2.24901 12.263L13.4019 2.14364L24.5562 12.2603L24.5716 12.2737L24.5702 24.6758Z" fill="#A6A6A6"/>
          </svg>
        `}}render(){let e=!!this.currentUser;document.removeEventListener("click",this.handleDocClick);let t="assets/img/logo_light_last.png",r="assets/img/logo_light_last.webp";this.innerHTML=`
      <header class="site-top">
        <div class="brand">
          <picture>
            <source srcset="${r}" type="image/webp" />
            <img src="${t}" alt="Logo" class="brand-logo" width="272" height="74" decoding="async" fetchpriority="high" />
          </picture>
        </div>

        <nav class="top-menu">
          ${this.renderNavLinks()}
        </nav>

        <div class="header-actions">
          ${e?`
                <div class="avatar-menu">
                  <button class="avatar-btn" type="button" aria-label="\u041F\u0440\u043E\u0444\u0430\u0439\u043B \u0446\u044D\u0441 \u043D\u044D\u044D\u0445"></button>
                  <div class="avatar-dropdown" role="menu" aria-label="\u041F\u0440\u043E\u0444\u0430\u0439\u043B \u0446\u044D\u0441">
                    <button class="avatar-action avatar-logout" type="button" role="menuitem">\u0413\u0430\u0440\u0430\u0445</button>
                  </div>
                </div>
                <button class="logout-btn" type="button">\u0413\u0430\u0440\u0430\u0445</button>
              `:'<button class="login-btn" type="button">\u041D\u044D\u0432\u0442\u0440\u044D\u0445</button>'}
        </div>
      </header>
    `;let i=this.querySelector(".login-btn");if(i&&i.addEventListener("click",()=>{location.hash="#login"}),window.matchMedia){let d=window.matchMedia("(prefers-color-scheme: dark)"),l=this.querySelector(".brand-logo");if(l){let c=()=>{l.src=t};c(d),d.addEventListener?d.addEventListener("change",c):d.addListener(c)}}let s=this.querySelector(".avatar-btn");s&&(s.innerHTML='<img src="assets/img/profile.jpg" alt="\u041F\u0440\u043E\u0444\u0430\u0439\u043B" width="40" height="40" decoding="async">',s.addEventListener("click",()=>{location.hash="#profile"}));let a=this.querySelector(".avatar-action");a&&a.addEventListener("click",()=>{location.hash="#profile"}),this.querySelectorAll(".avatar-logout, .logout-btn").forEach(d=>{d.addEventListener("click",async()=>{try{await fetch("/api/auth/logout",{method:"POST"})}catch{}localStorage.removeItem("auth_token"),localStorage.removeItem("authLoggedIn"),localStorage.removeItem("authRole"),localStorage.removeItem("authPhone"),localStorage.removeItem("authStudentId"),localStorage.removeItem("courierPaid"),localStorage.removeItem("courier_payment_paid"),localStorage.removeItem("appState"),localStorage.removeItem("deliveryActive"),localStorage.setItem("courierPaid","0"),this.currentUser=null,window.dispatchEvent(new Event("user-updated")),location.hash="#home"})})}handleDocClick(e){this.contains(e.target)||this.classList.remove("profile-open")}handleUserUpdated(){this.loadUser()}handleAppStateChanged(){this.render(),this.updateActive()}async loadUser(){try{let e=await fetch("/api/auth/me");if(!e.ok)this.currentUser=null;else{let t=await e.json();this.currentUser=t?.user||null}}catch{this.currentUser=null}this.render(),this.updateActive()}updateActive(){location.hash||history.replaceState(null,"","#home");let e=location.hash||"#home",t=new Set(this.getNavLinks().map(i=>i.href));if(t.add("#pay"),t.add("#login"),!t.size)return;if(!t.has(e)){location.hash="#home";return}this.querySelectorAll(".top-menu a").forEach(i=>{let s=i.getAttribute("href");i.classList.toggle("is-active",s===e)});let r=this.querySelector(".login-btn");r&&(r.style.display=e==="#login"?"none":"")}};customElements.define("site-header",R);var _=class extends HTMLElement{connectedCallback(){this._views=Array.from(this.querySelectorAll("[data-route]")),this._current=null,window.addEventListener("hashchange",()=>this.applyRoute()),this.applyRoute()}applyRoute(){let e=(location.hash||"#home").replace("#","")||"home",t=localStorage.getItem("authRole"),r=localStorage.getItem("courierPaid"),i=localStorage.getItem("authLoggedIn"),s=localStorage.getItem("appState")||"guest";if(s==="courier"&&e==="orders"){alert("\u0425\u04AF\u0440\u0433\u044D\u043B\u0442 \u0445\u0438\u0439\u0436 \u0431\u0430\u0439\u0445 \u04AF\u0435\u0434 \u0437\u0430\u0445\u0438\u0430\u043B\u0433\u044B\u043D \u0445\u044D\u0441\u044D\u0433\u0442 \u043E\u0440\u043E\u0445 \u0431\u043E\u043B\u043E\u043C\u0436\u0433\u04AF\u0439"),location.hash="#home";return}if(s==="customer"&&e==="delivery"){alert("\u0417\u0430\u0445\u0438\u0430\u043B\u0433\u0430 \u04E9\u0433\u0441\u04E9\u043D \u04AF\u0435\u0434 \u0445\u04AF\u0440\u0433\u044D\u043B\u0442\u0438\u0439\u043D \u0445\u044D\u0441\u044D\u0433\u0442 \u043E\u0440\u043E\u0445 \u0431\u043E\u043B\u043E\u043C\u0436\u0433\u04AF\u0439"),location.hash="#home";return}if(e==="delivery"){if(i!=="1"){alert("\u042D\u043D\u044D \u0445\u044D\u0441\u044D\u0433 \u0437\u04E9\u0432\u0445\u04E9\u043D \u0445\u04AF\u0440\u0433\u044D\u0433\u0447\u0438\u0434 \u043D\u044D\u044D\u043B\u0442\u0442\u044D\u0439"),location.hash="#login";return}if(t!=="courier"){alert("\u042D\u043D\u044D \u0445\u044D\u0441\u044D\u0433 \u0437\u04E9\u0432\u0445\u04E9\u043D \u0445\u04AF\u0440\u0433\u044D\u0433\u0447\u0438\u0434 \u043D\u044D\u044D\u043B\u0442\u0442\u044D\u0439"),location.hash="#home";return}if(r!=="1"){alert("\u0422\u04E9\u043B\u0431\u04E9\u0440 \u0442\u04E9\u043B\u0441\u043D\u0438\u0439 \u0434\u0430\u0440\u0430\u0430 \u0445\u04AF\u0440\u0433\u044D\u043B\u0442\u0438\u0439\u043D \u0445\u044D\u0441\u044D\u0433 \u043D\u044D\u044D\u0433\u0434\u044D\u043D\u044D"),location.hash="#pay";return}}let a=this._views.find(d=>d.dataset.route===e);if(!a)return;if(!this._current){this._views.forEach(d=>{let l=d===a;d.hidden=!l,d.classList.toggle("is-active",l),d.classList.remove("is-leaving")}),this._current=a;return}if(this._current===a)return;let n=this._current;this._current=a,n.hidden=!0,n.classList.remove("is-active"),a.hidden=!1,a.classList.add("is-active")}};customElements.define("num-router",_);function Ae(){return localStorage.getItem("appState")||"guest"}function ue(o=document){let e=Ae(),t=localStorage.getItem("authRole")||"",r=localStorage.getItem("deliveryActive")==="1";return o.querySelectorAll('[data-role="order-action"]').forEach(i=>{let s=e==="courier"&&r&&t!=="courier";"disabled"in i&&(i.disabled=s),i.style.pointerEvents=s?"none":"",i.style.opacity=s?"0.5":"",i.title=s?"\u0425\u04AF\u0440\u0433\u044D\u043B\u0442 \u0445\u0438\u0439\u0436 \u0431\u0430\u0439\u0445 \u04AF\u0435\u0434 \u0437\u0430\u0445\u0438\u0430\u043B\u0433\u0430 \u04E9\u0433\u04E9\u0445 \u0431\u043E\u043B\u043E\u043C\u0436\u0433\u04AF\u0439":""}),o.querySelectorAll('[data-role="courier-action"]').forEach(i=>{let s=t!=="courier";"disabled"in i&&(i.disabled=s),i.style.pointerEvents=s?"none":"",i.style.opacity=s?"0.5":"",i.title=s?"\u0425\u04AF\u0440\u0433\u044D\u0433\u0447\u044D\u044D\u0440 \u043D\u044D\u0432\u0442\u044D\u0440\u0441\u043D\u0438\u0439 \u0434\u0430\u0440\u0430\u0430 \u0445\u04AF\u0440\u0433\u044D\u043B\u0442 \u0430\u0432\u0430\u0445 \u0431\u043E\u043B\u043E\u043C\u0436\u0442\u043E\u0439":""}),o.querySelectorAll("[data-show-in]").forEach(i=>{let s=String(i.getAttribute("data-show-in")||"").split(",").map(a=>a.trim()).filter(Boolean);i.style.display=s.includes(e)?"":"none"}),o.querySelectorAll("[data-appstate-label]").forEach(i=>{i.textContent=e.toUpperCase()}),e}window.addEventListener("app-state-changed",()=>ue(document));window.addEventListener("DOMContentLoaded",()=>ue(document));var H="http://localhost:3000";function h(o,e={}){let t=o.startsWith("http")?o:`${H}${o}`;return fetch(t,{credentials:"include",...e})}var me="appState",pe=new Set(["guest","customer","courier"]);function fe(){let o=localStorage.getItem(me);return pe.has(o)?o:"guest"}function ge(o){let e=pe.has(o)?o:"guest",t=fe();return localStorage.setItem(me,e),t!==e&&window.dispatchEvent(new CustomEvent("app-state-changed",{detail:{prev:t,next:e}})),e}async function qe(){ge("guest"),localStorage.setItem("deliveryActive","0");try{await h("/api/active-order",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({order:null})})}catch{}localStorage.removeItem("deliverySteps");try{await h("/api/delivery-cart",{method:"DELETE"})}catch{}localStorage.removeItem("orderStep"),window.dispatchEvent(new Event("order-updated")),window.dispatchEvent(new Event("delivery-cart-updated"))}window.NumAppState={getState:fe,setState:ge,logout:qe};function S(o){return Number(o||0).toLocaleString("mn-MN")+"\u20AE"}function ve(o){return parseInt(String(o||"").replace(/[^\d]/g,""),10)||0}function ye(o){let e=new Date(o);if(isNaN(e.getTime()))return"";let t=e.toLocaleDateString("en-US",{month:"2-digit",day:"2-digit",year:"2-digit"}),r=e.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});return`${t} \u2022 ${r}`}function I(o){let e=new Date(o);if(isNaN(e.getTime()))return"";let t=String(e.getMonth()+1).padStart(2,"0"),r=String(e.getDate()).padStart(2,"0"),i=String(e.getFullYear()).slice(-2),s=String(e.getHours()).padStart(2,"0"),a=String(e.getMinutes()).padStart(2,"0");return`${t}/${r}/${i}\u2022${s}:${a}`}var N=class extends HTMLElement{connectedCallback(){this.currentUser=null,this.pendingOrder=null,this.pendingOffer=null,this._loaded=!1,this.handleRouteChange=()=>this.onRouteChange(),window.addEventListener("hashchange",this.handleRouteChange),this.render(),this.Element_qs(),this.confirmModal_events(),this.events(),this.handleRouteChange()}disconnectedCallback(){window.removeEventListener("hashchange",this.handleRouteChange),this.orderBtn&&this.handleOrderClick&&this.orderBtn.removeEventListener("click",this.handleOrderClick),this.fromSel&&this.handleFromChange&&this.fromSel.removeEventListener("change",this.handleFromChange),this.confirmModal&&this.handleConfirm&&(this.confirmModal.removeEventListener("confirm",this.handleConfirm),this.confirmModal.removeEventListener("cancel",this.handleCancel))}onRouteChange(){location.hash!=="#home"&&location.hash!==""||this._loaded!==!0&&(this._loaded=!0,this.load_places(),this.check_customer())}render(){this.innerHTML=`

      <section class="filter-section">
        <div class="middle-row">
          <div class="ctrl">
            <span><img src="assets/img/map_pin.svg" alt="icon" width="16" height="16" /></span>
            <select id="fromPlace">
              <option value="" disabled selected hidden>\u0425\u0430\u0430\u043D\u0430\u0430\u0441</option>
            </select>
          </div>

          <span class="arrow-icon"><img src="assets/img/arrow.svg" alt="icon" width="67" height="67" /></span>

          <div class="ctrl">
            <span><img src="assets/img/map_pin.svg" alt="icon" width="16" height="16" /></span>
            <select id="toPlace">
              <option value="" disabled selected hidden>\u0425\u0430\u0430\u0448\u0430\u0430</option>
            </select>
          </div>

          <date-time-picker></date-time-picker>
        </div>

        <div class="bottom-row">
          <div class="ctrl wide">
            <span><img src="assets/img/fork.svg" alt="icon" width="40" height="38" /></span>
            <select id="what">
              <option value="" disabled selected hidden>\u042E\u0443\u0433</option>
            </select>
          </div>
        </div>

        <sh-cart class="cart"></sh-cart>

        <div class="top-row">
          <button class="btn btn--accent order-btn" data-role="order-action">\u0417\u0430\u0445\u0438\u0430\u043B\u0430\u0445</button>
        </div>
      </section>

      <div class="offers-layout">
        <div class="offers-panel">
          <offers-list></offers-list>
        </div>
        <aside class="delivery-cart-panel">
          <delivery-cart></delivery-cart>
        </aside>
      </div>
      <offer-modal></offer-modal>
      <confirm-modal></confirm-modal>
    `}Element_qs(){this.fromSel=this.querySelector("#fromPlace"),this.toSel=this.querySelector("#toPlace"),this.whatSel=this.querySelector("#what"),this.orderBtn=this.querySelector(".order-btn")}events(){this.handleOrderClick=()=>this.prepareOrder(),this.handleFromChange=e=>this.onFromPlaceChange(e),this.orderBtn&&this.orderBtn.addEventListener("click",this.handleOrderClick),this.fromSel&&this.fromSel.addEventListener("change",this.handleFromChange)}confirmModal_events(){this.confirmModal=this.querySelector("confirm-modal"),this.confirmModal&&(this.handleConfirm=()=>this.confirmOrder(),this.handleCancel=()=>this.hideConfirmModal(),this.confirmModal.addEventListener("confirm",this.handleConfirm),this.confirmModal.addEventListener("cancel",this.handleCancel))}async check_customer(){let e=await this.fetchCurrentUser();if(e?.id)try{await this.syncCustomerInfo(e.id)}catch(t){console.error("herglegch shlghd aldaa grla",t)}}async fetchCurrentUser(){if(this.currentUser!==null)return this.currentUser;try{let e=await h("/api/auth/me");if(!e.ok)return null;let t=await e.json();return this.currentUser=t?.user||null,this.currentUser}catch{return null}}async syncCustomerInfo(e){if(!e)return;let t=await h(`/api/customers/${e}`);if(!t.ok)return;await t.json()&&window.dispatchEvent(new Event("user-updated"))}async load_places(){try{let[e,t]=await Promise.all([h("/api/from-places"),h("/api/to-places")]);if(!e.ok||!t.ok)return;let[r,i]=await Promise.all([e.json(),t.json()]);this.fillPlaceSelect(this.fromSel,r,"\u0425\u0430\u0430\u043D\u0430\u0430\u0441",s=>s.name),this.fillPlaceSelect(this.toSel,i,"\u0425\u0430\u0430\u0448\u0430\u0430",s=>s.name)}catch(e){console.warn("gzr acaalh aldaa:",e)}}fillPlaceSelect(e,t,r,i){if(!e)return;let s=t||[];e.innerHTML=`<option value="" disabled selected hidden>${r}</option>`,e.innerHTML+=s.map(a=>`<option value="${a.id}">${i(a)}</option>`).join("")}async onFromPlaceChange(e){let t=e?.target?.value;if(!(!t||!this.whatSel))try{let r=await h(`/api/menus/${t}`);if(!r.ok)return;let s=(await r.json()).menu_json||[];this.fromMenuSelect(s)}catch(r){console.warn("menu acaalh aldaa:",r)}}fromMenuSelect(e){if(!this.whatSel)return;let t=e.filter(s=>s.category==="food"),r=e.filter(s=>s.category==="drink"),i=e.filter(s=>!s.category);this.whatSel.innerHTML='<option value="" disabled selected hidden>\u042E\u0443\u0433</option>',this.appendMenuGroup("\u0418\u0434\u044D\u0445 \u044E\u043C",t),this.appendMenuGroup("\u0423\u0443\u0445 \u044E\u043C",r),this.appendMenuGroup("\u0411\u0443\u0441\u0430\u0434",i)}appendMenuGroup(e,t){if(t.length===0||!this.whatSel)return;let r=document.createElement("optgroup");r.label=e,t.forEach(i=>{let s=document.createElement("option");s.value=i.id,s.dataset.price=i.price,s.dataset.name=i.name,s.textContent=`${i.name} \u2014 ${i.price}\u20AE`,r.appendChild(s)}),this.whatSel.appendChild(r)}getScheduledAtISO(){return this.querySelector("date-time-picker")?.iso}hideConfirmModal(){this.confirmModal?.close&&this.confirmModal.close(),this.pendingOrder=null,this.pendingOffer=null}prepareOrder(){if(!this.fromSel||!this.toSel||!this.whatSel)return;if(!this.fromSel.value){alert("\u0425\u0430\u0430\u043D\u0430\u0430\u0441\u0430\u0430 \u0441\u043E\u043D\u0433\u043E\u043D\u043E \u0443\u0443");return}if(!this.toSel.value){alert("\u0425\u0430\u0430\u0448\u0430\u0430\u0433\u0430\u0430 \u0441\u043E\u043D\u0433\u043E\u043D\u043E \u0443\u0443");return}let e=this.getCartSummary();if(e.totalQty===0){alert("\u042E\u0443\u0433 (\u0445\u043E\u043E\u043B/\u0431\u0430\u0440\u0430\u0430) \u0441\u043E\u043D\u0433\u043E\u043D\u043E \u0443\u0443");return}let t=this.getScheduledAtISO(),r=this.buildItemsFromCart(e);this.pendingOrder={fromId:this.fromSel.value,toId:this.toSel.value,from:this.fromSel.selectedOptions[0].textContent,to:this.toSel.selectedOptions[0].textContent,scheduledAt:t},this.pendingOffer={items:r,total:e.total,deliveryFee:e.totalQty>0?e.deliveryFee:500,thumb:e.deliveryIcon||"assets/img/document.svg"},this.confirmModal?.open&&this.confirmModal.open(this.pendingOrder,this.pendingOffer)}getCartSummary(){return this.querySelector("sh-cart")?.getSummary()||{totalQty:0,items:[],total:0,deliveryFee:0}}buildItemsFromCart(e){return e.items.map(t=>({id:t.name,name:t.name,price:t.price,qty:t.qty}))}async confirmOrder(){if(!this.pendingOrder||!this.pendingOffer){this.hideConfirmModal();return}let e=await this.fetchCurrentUser();if(!e?.id){localStorage.setItem("pendingOrderDraft",JSON.stringify(this.pendingOrder)),localStorage.setItem("pendingOfferDraft",JSON.stringify(this.pendingOffer)),this.hideConfirmModal(),location.hash="#login";return}if(!this.pendingOrder.fromId||!this.pendingOrder.toId){alert("\u0425\u0430\u0430\u043D\u0430\u0430\u0441/\u0425\u0430\u0430\u0448\u0430\u0430 \u0441\u043E\u043D\u0433\u043E\u043D\u043E \u0443\u0443");return}if(this.pendingOffer.items.length===0){alert("\u0421\u0430\u0433\u0441 \u0445\u043E\u043E\u0441\u043E\u043D \u0431\u0430\u0439\u043D\u0430");return}let t=this.pendingOffer.items.map(i=>({menuItemKey:i.id,name:i.name,unitPrice:i.price,qty:i.qty})).filter(i=>i.qty>0),r={customerId:e.id,fromPlaceId:this.pendingOrder.fromId,toPlaceId:this.pendingOrder.toId,scheduledAt:this.pendingOrder.scheduledAt,deliveryFee:this.pendingOffer.deliveryFee,items:t,customerName:e.name,customerPhone:e.phone,customerStudentId:e.student_id};try{let i=await h("/api/orders",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(r)}),s=await i.json();if(!i.ok){alert(s?.error||"\u0417\u0430\u0445\u0438\u0430\u043B\u0433\u0430 \u04AF\u04AF\u0441\u0433\u044D\u0445\u044D\u0434 \u0430\u043B\u0434\u0430\u0430 \u0433\u0430\u0440\u043B\u0430\u0430");return}let a={...this.pendingOrder,customer:{name:e.name,phone:e.phone,studentId:e.student_id}};try{await h("/api/active-order",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({order:a})})}catch{}window.NumAppState?.setState("customer","order_created"),window.dispatchEvent(new Event("order-updated")),this.addOfferToLocalList(e,s),this.hideConfirmModal(),this.scrollOffersIntoView()}catch{alert("\u0421\u0435\u0440\u0432\u0435\u0440\u0442\u044D\u0439 \u0445\u043E\u043B\u0431\u043E\u0433\u0434\u043E\u0436 \u0447\u0430\u0434\u0441\u0430\u043D\u0433\u04AF\u0439")}}addOfferToLocalList(e,t){let r=JSON.parse(localStorage.getItem("offers")||"[]");r.unshift({...this.pendingOffer,orderId:t.orderId,meta:ye(this.pendingOrder.scheduledAt),from:this.pendingOrder.from,to:this.pendingOrder.to,title:`${this.pendingOrder.from} - ${this.pendingOrder.to}`,price:S((t?.total??this.pendingOffer.total)||0),thumb:this.pendingOffer.thumb||"assets/img/box.svg",customer:{name:e.name,phone:e.phone,studentId:e.student_id,avatar:e.avatar||"assets/img/profile.jpg"},sub:this.pendingOffer.items.map(s=>({name:`${s.name} x${s.qty}`,price:S(s.price*s.qty)}))}),localStorage.setItem("offers",JSON.stringify(r));let i=this.querySelector("offers-list");"items"in i&&(i.items=r),window.dispatchEvent(new Event("offers-updated"))}scrollOffersIntoView(){let e=document.querySelector("offers-list");setTimeout(()=>{e.scrollIntoView({behavior:"smooth",block:"start"})},150)}};customElements.define("home-page",N);function v(o){return String(o??"").replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}var D=class extends HTMLElement{constructor(){super(),this.handleRouteChange=this.handleRouteChange.bind(this),this.applyActiveOrderBound=this.applyActiveOrder.bind(this),this.renderDeliveryCartBound=this.renderDeliveryCart.bind(this),this._initialized=!1}connectedCallback(){window.addEventListener("hashchange",this.handleRouteChange),this.handleRouteChange()}disconnectedCallback(){window.removeEventListener("hashchange",this.handleRouteChange),window.removeEventListener("order-updated",this.applyActiveOrderBound),window.removeEventListener("delivery-cart-updated",this.renderDeliveryCartBound)}handleRouteChange(){if(location.hash!=="#delivery")return;let e=localStorage.getItem("authLoggedIn"),t=localStorage.getItem("authRole"),r=localStorage.getItem("courierPaid");if(e!=="1"){location.hash="#login";return}if(t!=="courier"){location.hash="#home";return}if(r!=="1"){location.hash="#pay";return}this._initialized||(this.render(),window.addEventListener("order-updated",this.applyActiveOrderBound),window.addEventListener("delivery-cart-updated",this.renderDeliveryCartBound),this._initialized=!0),this.applyActiveOrder(),this.renderDeliveryCart()}render(){this.innerHTML=`
      <div class="container">
        <section class="orders">
          <h2>\u041C\u0438\u043D\u0438\u0439 \u0445\u04AF\u0440\u0433\u044D\u043B\u0442</h2>
          <div id="deliveryList" class="order-list"></div>
        </section>

        <section class="details">
          <del-order-details></del-order-details>
        </section>

        <section class="order-step">
          <h2>\u0417\u0430\u0445\u0438\u0430\u043B\u0433\u044B\u043D \u044F\u0432\u0446</h2>
          <del-order-progress></del-order-progress>
        </section>
      </div>
    `}applyActiveOrder(){this.fetchActiveOrder()}async fetchActiveOrder(){try{let e=await fetch("/api/active-order");if(!e.ok)return;let r=(await e.json())?.order;if(!r)return;let i=this.querySelector('d-orders[data-active="true"]');i&&r.from&&r.to&&(i.setAttribute("header",`${r.from} \u2192 ${r.to}`),r.item&&i.setAttribute("detail",r.item))}catch{}}renderDeliveryCart(){let e=this.querySelector("#deliveryList");e&&this.fetchDeliveryItems(e)}attachOrderSelection(e=[]){let t=this.querySelectorAll("d-orders");if(!t.length)return;let r=new Map(e.map(n=>[String(n.id||""),n]));t.forEach(n=>{n.addEventListener("click",()=>{let d=n.getAttribute("data-id"),l=r.get(String(d))||null;this.selectOrder(l,n)})});let i=t[0],s=i?.getAttribute("data-id"),a=r.get(String(s))||null;a&&this.selectOrder(a,i)}selectOrder(e,t){if(!e)return;this.querySelectorAll("d-orders").forEach(i=>{i.classList.toggle("is-active",i===t)});let r=new CustomEvent("delivery-select",{detail:{...e,id:e.orderId||e.id||null,orderId:e.orderId||null}});document.dispatchEvent(r)}async fetchDeliveryItems(e){let t=[];try{let a=await fetch("/api/delivery-cart");if(a.ok){let n=await a.json();t=Array.isArray(n?.items)?n.items:[]}}catch{t=[]}if(!t.length){e.innerHTML='<p class="muted">\u0425\u04AF\u0440\u0433\u044D\u043B\u0442 \u0441\u043E\u043D\u0433\u043E\u043E\u0433\u04AF\u0439 \u0431\u0430\u0439\u043D\u0430.</p>';let a=this.querySelector("del-order-details"),n=this.querySelector("del-order-progress");a&&a.setAttribute("data-empty","1"),n&&n.setAttribute("data-empty","1");return}let r=this.querySelector("del-order-details"),i=this.querySelector("del-order-progress");r&&r.removeAttribute("data-empty"),i&&i.removeAttribute("data-empty");let s=t.map(a=>{let n=Number(a.qty||1),d=[];a.meta&&d.push(a.meta),n&&d.push(`x${n}`);let l=d.join(" \u2022 "),c=String(a.title||""),u=c.split(" - "),m=u[0]||c,y=u.slice(1).join(" - "),w=a.order_id||null;return{...a,detail:l,from:m,to:y,createdAt:a.meta||"",orderId:w}});e.innerHTML=s.map(a=>`
        <d-orders
          data-id="${v(a.id||"")}"
          data-order-id="${v(a.orderId||"")}"
          data-from="${v(a.from||"")}"
          data-to="${v(a.to||"")}"
          data-created-at="${v(a.createdAt||"")}"
          header="${v(a.title||"")}"
          detail="${v(a.detail||"")}">
        </d-orders>
      `).join(""),this.attachOrderSelection(s)}};customElements.define("delivery-page",D);function C(o){return String(o??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;").replace(/'/g,"&#39;")}function O(o){return o>5?"assets/img/box.svg":o>=2?"assets/img/tor.svg":"assets/img/document.svg"}var U=class extends HTMLElement{connectedCallback(){this.render()}render(){this.innerHTML=`
      <div class="order-list" id="orderList">
          <p class="muted">\u0417\u0430\u0445\u0438\u0430\u043B\u0433\u0430 \u0430\u0447\u0430\u0430\u043B\u043B\u0430\u0436 \u0431\u0430\u0439\u043D\u0430...</p>
        </div>
    `}showLoading(){let e=this.querySelector("#orderList");e&&(e.innerHTML='<p class="muted">\u0417\u0430\u0445\u0438\u0430\u043B\u0433\u0430 \u0430\u0447\u0430\u0430\u043B\u043B\u0430\u0436 \u0431\u0430\u0439\u043D\u0430...</p>')}showEmpty(){let e=this.querySelector("#orderList");e&&(e.innerHTML='<p class="muted">\u0417\u0430\u0445\u0438\u0430\u043B\u0433\u0430 \u0430\u043B\u0433\u0430.</p>')}renderOrders(e){let t=this.querySelector("#orderList");if(t){if(!e.length){this.showEmpty();return}t.innerHTML=e.map(r=>this.renderOrderCard(r)).join("")}}renderOrderCard(e){let t=this.parseOrderTimestamp(e)||Date.now(),r=I(t),i=e.items,s=i.map(d=>`${d.name} \xD7${d.qty}`).join(" \xB7 "),a=i.reduce((d,l)=>d+(Number(l?.qty)||0),0),n=this.getOfferThumb(e?.id)||O(a);return`
      <div class="order-card" data-order='${JSON.stringify(e)}'>
        <div class="order-info">
          <h3 class="order-title">${C(e.from_name||"")} - ${C(e.to_name||"")}</h3>
          <h4>${C(r)}</h4>
          <p>${C(s||"\u0411\u0430\u0440\u0430\u0430 \u0431\u0430\u0439\u0445\u0433\u04AF\u0439")}</p>
          <p class="order-total">\u0414\u04AF\u043D: ${S(e.total_amount||0)}</p>
        </div>
        <img src="${n}" alt="hemjee" width="57" height="57" decoding="async">
      </div>
    `}parseOrderTimestamp(e){return this.parseDate(e.scheduled_at)}parseDate(e){let t=Date.parse(e);return Number.isNaN(t)?null:t}getOfferThumb(e){if(!e)return"";try{let t=localStorage.getItem("offers"),r=t?JSON.parse(t):[];return(Array.isArray(r)?r.find(s=>(s?.orderId||s?.id)===e):null)?.thumb||""}catch{return""}}};customElements.define("my-order",U);var P=class extends HTMLElement{connectedCallback(){this.render(),this.OrderCardClicks(),this.selectedOrder=null,this.orderStream=null,this.handleRouteChange=()=>{this.onRouteChange()},window.addEventListener("hashchange",this.handleRouteChange),this.handleRouteChange()}onRouteChange(){if(location.hash!=="#orders"){this.cleanup();return}this.loadOrders(),this.initOrderStream(),this.RatingComplete()}disconnectedCallback(){window.removeEventListener("hashchange",this.handleRouteChange),this.cleanup()}cleanup(){this.handleRatingComplete&&window.removeEventListener("rating-completed",this.handleRatingComplete),this.orderStream&&(this.handleOrderStatusEvent&&this.orderStream.removeEventListener("order-status",this.handleOrderStatusEvent),this.handleOrderUpdatedEvent&&this.orderStream.removeEventListener("order-updated",this.handleOrderUpdatedEvent),this.orderStream.close(),this.orderStream=null)}render(){this.innerHTML=`
      <main class="container">
        <section class="order-side">
        <section class="orders">
          <h2>\u041C\u0438\u043D\u0438\u0439 \u0437\u0430\u0445\u0438\u0430\u043B\u0433\u0430</h2>
            <my-order></my-order>
        </section>

          <section class="delivery-info">
            <courier-card id="courierBox"></courier-card>
          </section>
        </section>

        <section class="details">
          <h2>\u0417\u0430\u0445\u0438\u0430\u043B\u0433\u044B\u043D \u044F\u0432\u0446</h2>
          <order-progress></order-progress>

          <rating-modal></rating-modal>
        </section>
      </main>
    `}async loadOrders(){let e=this.querySelector("my-order");if(!e)return;e.showLoading();let t=await this.getUserId();if(!t){location.hash="#login";return}let r=`?customerId=${t}`;try{let i=await h(`/api/orders${r}`),s=await i.json();if(!i.ok)throw new Error(s?.error||"\u0410\u043B\u0434\u0430\u0430");let a=this.filterExpired(s),n=a.filter(d=>!this.isOrderRated(d.id));a.length===0&&window.NumAppState?.logout("order_expired"),e.renderOrders(n),n.length>0?this.selectOrder(n[0]):this.selectOrder(null)}catch{}}async getUserId(){try{let e=await h("/api/auth/me");if(e.ok)return(await e.json())?.user?.id}catch{}return""}filterExpired(e){return e.filter(t=>{let r=this.querySelector("my-order");if(!r)return;let i=r.parseOrderTimestamp(t);return i!==null&&i>=Date.now()})}isOrderRated(e){try{return JSON.parse(localStorage.getItem("ratedOrders")||"[]").includes(String(e))}catch{return!1}}selectOrder(e){this.selectedOrder=e,document.dispatchEvent(new CustomEvent("order-select",{detail:e})),this.loadCourierForOrder(e)}OrderCardClicks(){let e=this.querySelector("my-order");e&&e.addEventListener("click",t=>{let r=t.target.closest(".order-card");if(!r)return;let i=r.getAttribute("data-order");if(!i)return;let s=JSON.parse(decodeURIComponent(i));this.selectOrder(s)})}async loadCourierForOrder(e){let t=this.querySelector("#courierBox");if(!t)return;if(!e){t.setEmpty?.();return}let r=e?.courier||null;if(!r){t.setEmpty?.();return}try{let i=await h("/api/auth/me");if(i.ok){let{user:s}=await i.json();if(s&&r&&String(s.id)===String(r.id)){t.setEmpty?.();return}}}catch{}t.setData?.(r)}RatingComplete(){this.handleRatingComplete=()=>{this.loadOrders()},window.addEventListener("rating-completed",this.handleRatingComplete)}initOrderStream(){localStorage.getItem("authRole")!=="customer"||!window.EventSource||this.orderStream||(this.orderStream=new EventSource(`${H}/api/orders/stream`),this.handleOrderStatusEvent=t=>{try{let r=JSON.parse(t.data||"{}");if(!r.orderId||!r.status)return;(!this.selectedOrder||String(this.selectedOrder.id)===String(r.orderId))&&(this.selectedOrder&&(this.selectedOrder.status=r.status),document.dispatchEvent(new CustomEvent("order-status-change",{detail:{status:r.status}})))}catch{}},this.handleOrderUpdatedEvent=()=>{this.loadOrders()},this.orderStream.addEventListener("order-status",this.handleOrderStatusEvent),this.orderStream.addEventListener("order-updated",this.handleOrderUpdatedEvent))}};customElements.define("orders-page",P);var B=class extends HTMLElement{connectedCallback(){this.handleRouteChange=this.handleRouteChange?.bind(this)||(()=>this.onRouteChange()),window.addEventListener("hashchange",this.handleRouteChange),this.handleRouteChange()}onRouteChange(){location.hash==="#profile"&&(this.renderAccessGate(),this.ensureAuthenticated())}renderAccessGate(){this.innerHTML=`
      <section class="profile-page">
        <div class="profile-hero">
          <div class="profile-hero__content">
            <div class="profile-meta">
              <div class="hero-info hero-info--stack">
                <strong>\u041F\u0440\u043E\u0444\u0430\u0439\u043B \u0430\u0447\u0430\u0430\u043B\u0436 \u0431\u0430\u0439\u043D\u0430...</strong>
                <span class="muted">\u041D\u044D\u0432\u0442\u0440\u044D\u043B\u0442 \u0448\u0430\u043B\u0433\u0430\u0436 \u0431\u0430\u0439\u043D\u0430</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    `}async ensureAuthenticated(){try{let e=await fetch("/api/auth/me");if(!e.ok){this.redirectToLogin();return}let t=await e.json();if(!t?.user?.id){this.redirectToLogin();return}this.currentUser=t.user,this.renderProfile()}catch{this.redirectToLogin()}}redirectToLogin(){this.innerHTML=`
      <section class="profile-page">
        <div class="profile-hero">
          <div class="profile-hero__content">
            <div class="profile-meta">
              <div class="hero-info hero-info--stack">
                <strong>\u041F\u0440\u043E\u0444\u0430\u0439\u043B \u0445\u0430\u0440\u0430\u0445\u044B\u043D \u0442\u0443\u043B\u0434 \u043D\u044D\u0432\u0442\u044D\u0440\u043D\u044D \u04AF\u04AF.</strong>
              </div>
            </div>
          </div>
        </div>
      </section>
    `,location.hash="#login"}renderProfile(){this.profileData=this.loadProfileData();let e=this.getActiveOrders(),t=this.buildActiveOrdersMarkup(e),r=this.getReviews(),i=this.buildReviewsMarkup(r),s=this.buildReviewsMarkup(r),a=this.getOrderHistory(),n=this.getDeliveryHistory(),d=this.currentUser?.role==="courier";this.innerHTML=`
      <section class="profile-page">
        <div class="profile-hero">
          <div class="profile-hero__content">
            <div class="avatar-wrap">
              <img src="${this.profileData.avatar||"assets/img/profile.jpg"}" alt="\u041F\u0440\u043E\u0444\u0430\u0439\u043B \u0437\u0443\u0440\u0430\u0433" class="avatar profile-avatar" width="40" height="40" decoding="async" />
            </div>

            <div class="profile-meta">
              <div class="hero-info hero-info--stack">
                <div><span class="label">\u041D\u044D\u0440:</span><strong class="profile-name">${this.profileData.name}</strong></div>
                <div><span class="label">\u0423\u0442\u0430\u0441:</span><strong class="profile-phone">${this.profileData.phone}</strong></div>
                <div><span class="label">ID:</span><strong class="profile-id">${this.profileData.id}</strong></div>
                <div><span class="label">\u0418\u043C\u044D\u0439\u043B:</span><strong class="profile-email">${this.profileData.email}</strong></div>
              </div>

              <div class="hero-actions">
                <button class="btn primary" data-modal-open="ordersModal" id="openOrderBtn">\u041C\u0438\u043D\u0438\u0439 \u0437\u0430\u0445\u0438\u0430\u043B\u0433\u0430</button>
                <button class="btn ghost" data-modal-open="deliveryModal" id="openDeliveryBtn">\u041C\u0438\u043D\u0438\u0439 \u0445\u04AF\u0440\u0433\u044D\u043B\u0442</button>
              </div>
            </div>

            <div class="hero-stats">
              <div class="stat-card">
                <p>\u041D\u0438\u0439\u0442 \u0437\u0430\u0445\u0438\u0430\u043B\u0433\u0430</p>
                <strong id="orderTotal">0</strong>
              </div>
              ${d?`
                <div class="stat-card">
                  <p>\u0414\u0443\u043D\u0434\u0430\u0436 \u04AF\u043D\u044D\u043B\u0433\u044D\u044D</p>
                  <div class="stars avg-stars" aria-label="0 \u043E\u0434">
                    <span>\u2605</span><span>\u2605</span><span>\u2605</span><span>\u2605</span><span>\u2605</span>
                  </div>
                  <small class="avg-rating-text">0 / 5</small>
                </div>
              `:""}
            </div>
          </div>
        </div>

        <div class="profile-actions-desktop">
          <button class="action-card" type="button" data-modal-open="ordersModal">
            <span class="action-title">\u041C\u0438\u043D\u0438\u0439 \u0437\u0430\u0445\u0438\u0430\u043B\u0433\u0430</span>
            <span class="action-subtitle">\u0422\u04AF\u04AF\u0445, \u0442\u04E9\u043B\u04E9\u0432\u0438\u0439\u0433 \u0445\u0430\u0440\u0430\u0445</span>
          </button>
          <button class="action-card" type="button" data-modal-open="deliveryModal">
            <span class="action-title">\u041C\u0438\u043D\u0438\u0439 \u0445\u04AF\u0440\u0433\u044D\u043B\u0442</span>
            <span class="action-subtitle">\u0425\u04AF\u0440\u0433\u044D\u043B\u0442\u0438\u0439\u043D \u043C\u044D\u0434\u044D\u044D\u043B\u044D\u043B</span>
          </button>
        </div>

        ${d?`
          <div class="profile-grid">
            <article class="profile-card reviews">
              <header>
                <div>
                  <p class="eyebrow">\u0421\u044D\u0442\u0433\u044D\u0433\u0434\u044D\u043B</p>
                </div>
                <button class="ghost-btn small open-reviews">\u0411\u04AF\u0433\u0434\u0438\u0439\u0433 \u0445\u0430\u0440\u0430\u0445</button>
              </header>

              <div class="review-list">${i}</div>
            </article>
          </div>
        `:""}
      </section>

      <div class="modal-backdrop" data-modal="profileModal">
        <div class="modal-card">
          <header class="modal-header">
            <div>
              <p class="eyebrow">\u041F\u0440\u043E\u0444\u0430\u0439\u043B \u0437\u0430\u0441\u0430\u0445</p>
              <h3>\u041C\u044D\u0434\u044D\u044D\u043B\u043B\u044D\u044D \u0448\u0438\u043D\u044D\u0447\u043B\u044D\u0445</h3>
            </div>
            <button class="icon-btn close-modal" data-close="profileModal">\xD7</button>
          </header>
          <form id="profileForm" class="modal-body">
            <label>
              <span>\u041D\u044D\u0440</span>
              <input type="text" name="name" required />
            </label>
            <label>
              <span>\u0423\u0442\u0430\u0441</span>
              <input type="tel" name="phone" required />
            </label>
            <label>
              <span>\u0418\u043C\u044D\u0439\u043B</span>
              <input type="email" name="email" required />
            </label>
            <label>
              <span>ID</span>
              <input type="text" name="id" />
            </label>
            <label>
              <span>\u0417\u0443\u0440\u0430\u0433 (URL)</span>
              <input type="url" name="avatar" placeholder="assets/img/profile.jpg" />
            </label>
            <div class="modal-actions">
              <button type="button" class="btn ghost close-modal" data-close="profileModal">\u0411\u043E\u043B\u0438\u0445</button>
              <button type="submit" class="btn primary">\u0425\u0430\u0434\u0433\u0430\u043B\u0430\u0445</button>
            </div>
          </form>
        </div>
      </div>

      ${d?`
        <div class="modal-backdrop" data-modal="reviewsModal">
          <div class="modal-card">
            <header class="modal-header">
              <div>
                <p class="eyebrow">\u0421\u044D\u0442\u0433\u044D\u0433\u0434\u043B\u04AF\u04AF\u0434</p>
              </div>
              <button class="icon-btn close-modal" data-close="reviewsModal">\xD7</button>
            </header>
            <div class="modal-body review-list modal-scroll">
              ${s}
            </div>
          </div>
        </div>
      `:""}

      <div class="modal-backdrop" data-modal="ordersModal">
        <div class="modal-card">
          <header class="modal-header">
            <div>
              <h3 class="modal-title">\u041C\u0438\u043D\u0438\u0439 \u0437\u0430\u0445\u0438\u0430\u043B\u0433\u0430</h3>
            </div>
            <button class="icon-btn close-modal" data-close="ordersModal">\xD7</button>
          </header>
          <div class="modal-body modal-scroll history-list" data-history="orders">
            ${this.buildHistoryMarkup(a,"\u0417\u0430\u0445\u0438\u0430\u043B\u0433\u0430 \u0431\u0430\u0439\u0445\u0433\u04AF\u0439")}
          </div>
        </div>
      </div>

      <div class="modal-backdrop" data-modal="deliveryModal">
        <div class="modal-card">
          <header class="modal-header">
            <div>
              <h3 class="modal-title">\u041C\u0438\u043D\u0438\u0439 \u0445\u04AF\u0440\u0433\u044D\u043B\u0442</h3>
            </div>
            <button class="icon-btn close-modal" data-close="deliveryModal">\xD7</button>
          </header>
          <div class="modal-body modal-scroll history-list" data-history="deliveries">
            ${this.buildHistoryMarkup(n,"\u0425\u04AF\u0440\u0433\u044D\u043B\u0442 \u0431\u0430\u0439\u0445\u0433\u04AF\u0439")}
          </div>
        </div>
      </div>
      <div class="history">
        <section class="btn-order" id="openOrderBtn">
          \u041C\u0438\u043D\u0438\u0439 \u0437\u0430\u0445\u0438\u0430\u043B\u0433\u0430
          <div class="history-inline" data-history="orders">
            ${this.buildHistoryMarkup(a,"\u0417\u0430\u0445\u0438\u0430\u043B\u0433\u0430 \u0431\u0430\u0439\u0445\u0433\u04AF\u0439")}
          </div>
        </section>
        <section class="btn-delivery" id="openDeliveryBtn">
          \u041C\u0438\u043D\u0438\u0439 \u0445\u04AF\u0440\u0433\u044D\u043B\u0442
          <div class="history-inline" data-history="deliveries">
            ${this.buildHistoryMarkup(n,"\u0425\u04AF\u0440\u0433\u044D\u043B\u0442 \u0431\u0430\u0439\u0445\u0433\u04AF\u0439")}
          </div>
        </section>
      </div>
    `,this.bindProfileData(),this.attachNavigation(),this.attachModalHandlers(),this.hydrateProfileFromApi(),this.loadActiveOrder(),this.loadOrderStats(),this.handleReviewsUpdated=this.loadReviews.bind(this),window.addEventListener("reviews-updated",this.handleReviewsUpdated),this.loadReviews(),this.loadOrderHistory(),this.loadDeliveryHistory()}disconnectedCallback(){window.removeEventListener("hashchange",this.handleRouteChange),this.handleReviewsUpdated&&window.removeEventListener("reviews-updated",this.handleReviewsUpdated)}loadProfileData(){return{name:"",phone:"",email:"",id:"",avatar:"assets/img/profile.jpg"}}async hydrateProfileFromApi(){try{let e=await fetch("/api/auth/me");if(!e.ok)return;let r=(await e.json())?.user;if(!r)return;this.profileData={...this.profileData,name:r.name||this.profileData.name,phone:r.phone||this.profileData.phone,id:r.student_id||this.profileData.id,avatar:r.avatar||this.profileData.avatar},this.bindProfileData()}catch{}}getActiveOrders(){return[]}getReviews(){return[]}getOrderHistory(){return[]}getDeliveryHistory(){return[]}buildActiveOrdersMarkup(e){return e.length?e.map(t=>{let r=[t.from,t.to].filter(Boolean).join(" \u2192 "),i=t.item?` \xB7 ${t.item}`:"";return`<span class="pill pill--order">${r||"\u0428\u0438\u043D\u044D \u0437\u0430\u0445\u0438\u0430\u043B\u0433\u0430"}${i}</span>`}).join(""):'<span class="pill pill--muted">\u0418\u0434\u044D\u0432\u0445\u0442\u044D\u0439 \u0437\u0430\u0445\u0438\u0430\u043B\u0433\u0430 \u0430\u043B\u0433\u0430</span>'}buildReviewsMarkup(e){if(!e.length)return'<p class="muted">\u0421\u044D\u0442\u0433\u044D\u0433\u0434\u044D\u043B \u0431\u0430\u0439\u0445\u0433\u04AF\u0439</p>';let t=e.map(r=>({...r,safeText:this.cleanReviewText(r.text)})).filter(r=>r.safeText);return t.length?t.map(r=>`
      <div class="review">
        <div>
          <p>${r.safeText}</p>
        </div>
        <span class="stars" aria-label="${r.stars} \u043E\u0434">${this.toStars(r.stars)}</span>
      </div>
    `).join(""):'<p class="muted">\u0421\u044D\u0442\u0433\u044D\u0433\u0434\u044D\u043B \u0431\u0430\u0439\u0445\u0433\u04AF\u0439</p>'}escapeHtml(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;").replace(/'/g,"&#39;")}cleanReviewText(e){let t=String(e??"").trim();return!t||/<[^>]*>/.test(t)||/&lt;|&gt;|&#60;|&#62;/i.test(t)?"":this.escapeHtml(t)}buildHistoryMarkup(e,t){return e.length?e.map((r,i)=>`
      <div class="history-card">
        <div class="history-icon" aria-hidden="true">
          <img src="${this.getHistoryIcon(i)}" alt="" width="32" height="32" decoding="async">
        </div>
        <div class="history-info">
          <h4>${r.title}</h4>
          <p class="muted">${r.detail}</p>
        </div>
        <div class="history-price">${r.price||""}</div>
      </div>
    `).join(""):`<div class="muted">${t}</div>`}formatPrice(e){return Number(e||0).toLocaleString("mn-MN")+"\u20AE"}formatHistoryDetail(e){let t=this.getOrderTimestamp(e);if(!t)return"";let r=new Date(t);return`${r.toLocaleDateString()} \xB7 ${r.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}`}async loadOrderHistory(){try{if(this.currentUser?.role&&this.currentUser.role!=="customer"){this.updateHistoryUI("orders",[],"\u0417\u0430\u0445\u0438\u0430\u043B\u0433\u0430 \u0431\u0430\u0439\u0445\u0433\u04AF\u0439");return}this.updateHistoryMessage("orders","\u0410\u0447\u0430\u0430\u043B\u043B\u0430\u0436 \u0431\u0430\u0439\u043D\u0430...");let e=await fetch("/api/orders/history/customer",{credentials:"include"}),t=await e.json().catch(()=>({}));if(!e.ok)return;let i=(Array.isArray(t?.items)?t.items:[]).map(s=>({title:`${s.from_name||""} \u2192 ${s.to_name||""}`.trim(),detail:this.formatHistoryDetail(s),price:this.formatPrice(s.total_amount||0)}));this.updateHistoryUI("orders",i,"\u0417\u0430\u0445\u0438\u0430\u043B\u0433\u0430 \u0431\u0430\u0439\u0445\u0433\u04AF\u0439")}catch{this.updateHistoryMessage("orders","\u0410\u0447\u0430\u0430\u043B\u043B\u0430\u0436 \u0447\u0430\u0434\u0441\u0430\u043D\u0433\u04AF\u0439")}}async loadDeliveryHistory(){try{if(this.currentUser?.role&&this.currentUser.role!=="courier"){this.updateHistoryUI("deliveries",[],"\u0425\u04AF\u0440\u0433\u044D\u043B\u0442 \u0431\u0430\u0439\u0445\u0433\u04AF\u0439");return}this.updateHistoryMessage("deliveries","\u0410\u0447\u0430\u0430\u043B\u043B\u0430\u0436 \u0431\u0430\u0439\u043D\u0430...");let e=await fetch("/api/orders/history/courier",{credentials:"include"}),t=await e.json().catch(()=>({}));if(!e.ok)return;let i=(Array.isArray(t?.items)?t.items:[]).map(s=>({title:`${s.from_name||""} \u2192 ${s.to_name||""}`.trim(),detail:this.formatHistoryDetail(s),price:this.formatPrice(s.total_amount||0)}));this.updateHistoryUI("deliveries",i,"\u0425\u04AF\u0440\u0433\u044D\u043B\u0442 \u0431\u0430\u0439\u0445\u0433\u04AF\u0439")}catch{this.updateHistoryMessage("deliveries","\u0410\u0447\u0430\u0430\u043B\u043B\u0430\u0436 \u0447\u0430\u0434\u0441\u0430\u043D\u0433\u04AF\u0439")}}updateHistoryUI(e,t,r){let i=this.buildHistoryMarkup(t,r);this.querySelectorAll(`[data-history="${e}"]`).forEach(s=>{s.innerHTML=i})}updateHistoryMessage(e,t){let r=`<div class="muted">${this.escapeHtml(t)}</div>`;this.querySelectorAll(`[data-history="${e}"]`).forEach(i=>{i.innerHTML=r})}getHistoryIcon(e=0){let t=["assets/img/document.svg","assets/img/tor.svg","assets/img/box.svg"];return t[e%t.length]}bindProfileData(){let{name:e,phone:t,email:r,id:i,avatar:s}=this.profileData;this.querySelectorAll(".profile-name").forEach(m=>{m.textContent=e});let n=this.querySelector(".profile-phone");if(n){n.textContent=t;let m=n.closest("div");m&&(m.style.display=t?"":"none")}let d=this.querySelector(".profile-email");if(d){d.textContent=r;let m=d.closest("div");m&&(m.style.display=r?"":"none")}let l=this.querySelector(".profile-id");if(l){l.textContent=i;let m=l.closest("div");m&&(m.style.display=i?"":"none")}let c=this.querySelector(".profile-avatar");c&&(c.src=s||"assets/img/profile.jpg");let u=this.querySelector("#profileForm");u&&(u.name.value=e,u.phone.value=t,u.email.value=r,u.id.value=i,u.avatar.value=s||"")}attachNavigation(){this.querySelectorAll("[data-nav]").forEach(t=>{t.addEventListener("click",()=>{let r=t.getAttribute("data-nav");r&&(location.hash=r)})})}attachModalHandlers(){let e=this.querySelector("#editProfileBtn");e&&e.addEventListener("click",()=>this.toggleModal("profileModal",!0)),this.querySelectorAll("[data-modal-open]").forEach(i=>{i.addEventListener("click",()=>{let s=i.getAttribute("data-modal-open");this.toggleModal(s,!0)})});let t=this.querySelector(".open-reviews");t&&t.addEventListener("click",()=>this.toggleModal("reviewsModal",!0)),this.querySelectorAll(".close-modal").forEach(i=>{i.addEventListener("click",()=>{let s=i.getAttribute("data-close");this.toggleModal(s,!1)})}),this.querySelectorAll(".modal-backdrop").forEach(i=>{i.addEventListener("click",s=>{if(s.target===i){let a=i.getAttribute("data-modal");this.toggleModal(a,!1)}})});let r=this.querySelector("#profileForm");r&&r.addEventListener("submit",i=>{i.preventDefault(),this.profileData={...this.profileData,name:r.name.value.trim(),phone:r.phone.value.trim(),email:r.email.value.trim(),id:r.id.value.trim(),avatar:this.profileData.avatar},this.saveProfileToApi(),this.bindProfileData(),window.dispatchEvent(new Event("user-updated")),this.toggleModal("profileModal",!1)})}async loadReviews(){try{if(this.currentUser?.role!=="courier"){this.updateReviewsUI([]);return}let e=await fetch(`/api/ratings/courier/${this.currentUser.id}`);if(!e.ok)return;let t=await e.json(),i=(Array.isArray(t?.items)?t.items:[]).map(s=>({text:s.comment||"",stars:s.stars}));this.updateReviewsUI(i),this.updateAverageRating(t?.courier?.rating_avg)}catch(e){console.error("Load reviews error:",e)}}updateReviewsUI(e){let t=this.buildReviewsMarkup(e),r=this.querySelectorAll(".review-list");r[0]&&(r[0].innerHTML=t),r[1]&&(r[1].innerHTML=t)}toStars(e){let t=Math.max(0,Math.min(5,Number(e)||0));return"\u2605\u2605\u2605\u2605\u2605".slice(0,t)+"\u2606\u2606\u2606\u2606\u2606".slice(0,5-t)}updateAverageRating(e){let t=this.querySelector(".avg-stars"),r=this.querySelector(".avg-rating-text");if(!t||!r)return;let i=Math.max(0,Math.min(5,Number(e)||0)),s=Math.round(i);t.querySelectorAll("span").forEach((n,d)=>{n.classList.toggle("dim",d>=s)}),t.setAttribute("aria-label",`${i.toFixed(1)} \u043E\u0434`),r.textContent=`${i.toFixed(1)} / 5`}async saveProfileToApi(){try{await fetch("/api/auth/me",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:this.profileData.name,phone:this.profileData.phone,studentId:this.profileData.id,avatar:this.profileData.avatar})})}catch{}}async loadActiveOrder(){try{let e=await fetch("/api/active-order");if(!e.ok)return;let r=(await e.json())?.order;if(!r)return;let i=this.buildActiveOrdersMarkup([r]),s=this.querySelector(".pill");s&&(s.outerHTML=i)}catch{}}async loadOrderStats(){let e=this.querySelector("#orderTotal");if(!e)return;let t=this.currentUser?.id;if(t)try{let r=await fetch(`/api/orders?customerId=${encodeURIComponent(t)}`,{credentials:"include"}),i=await r.json().catch(()=>[]);if(!r.ok||!Array.isArray(i))return;let s=i.length;e.textContent=String(s)}catch{}}getOrderTimestamp(e){let t=e.scheduled_at||e.scheduledAt||e.created_at||e.createdAt||e.meta||null;return this.parseDate(t)}parseDate(e){if(!e)return null;let t=Date.parse(e);if(!Number.isNaN(t))return t;let r=String(e).match(/(\d{1,2})\/(\d{1,2})\/(\d{2,4}).*?(\d{1,2}:\d{2}\s*[AP]M)/i);if(r){let[i,s,a,n,d]=r,l=n.length===2?`20${n}`:n,c=new Date(`${l}-${s}-${a} ${d}`);if(!Number.isNaN(c.getTime()))return c.getTime()}return null}toggleModal(e,t){let r=this.querySelector(`[data-modal="${e}"]`);r&&r.classList.toggle("open",t)}};customElements.define("profile-page",B);var j=class extends HTMLElement{connectedCallback(){this.handleRouteChange=this.handleRouteChange.bind(this),window.addEventListener("hashchange",this.handleRouteChange),this.handleRouteChange()}disconnectedCallback(){window.removeEventListener("hashchange",this.handleRouteChange)}async handleRouteChange(){if(location.hash!=="#pay")return;let e=localStorage.getItem("authLoggedIn"),t=localStorage.getItem("authRole");if(e!=="1"||t!=="courier"){location.hash="#login";return}let r=(localStorage.getItem("authPhone")||"").trim(),i=(localStorage.getItem("authStudentId")||"").trim(),s=(localStorage.getItem("authUserKey")||"").trim();if(!r&&!i)try{let p=await fetch("/api/auth/me",{credentials:"include"});if(p.ok){let g=(await p.json())?.user||{};r=String(g.phone||"").trim(),i=String(g.student_id||g.studentId||"").trim(),s=String(g.id||s||"").trim()}}catch{}let n=`courierPaid:${i||r||s||"courier"}`,d=()=>localStorage.getItem(n)==="1";this.innerHTML=`
      <div class="pay-wrap">
        <div class="pay-card">
          <div class="pay-head">
            <h2>\u0425\u04AF\u0440\u0433\u044D\u0433\u0447\u0438\u0439\u043D \u0442\u04E9\u043B\u0431\u04E9\u0440</h2>
            <button class="btn-close" type="button" aria-label="\u0425\u0430\u0430\u0445">\u2715</button>
          </div>

          <p class="pay-note">\u0422\u04E9\u043B\u0431\u04E9\u0440\u04E9\u04E9 \u0441\u043E\u043D\u0433\u043E\u043E\u0434 \u0442\u04E9\u043B\u0431\u04E9\u0440\u04E9\u04E9 \u0445\u0438\u0439\u0441\u043D\u044D\u044D\u0440 \u0445\u04AF\u0440\u0433\u044D\u043B\u0442\u0438\u0439\u043D \u0445\u044D\u0441\u044D\u0433 \u043D\u044D\u044D\u0433\u0434\u044D\u043D\u044D.</p>

          <div class="grid">
            <div class="block">
              <h4>\u0411\u0430\u0433\u0446 \u0441\u043E\u043D\u0433\u043E\u0445</h4>
              <div class="plan-grid">
                <label class="plan-card">
                  <input type="radio" name="paymentPlan" value="monthly" checked>
                  <span>\u0421\u0430\u0440\u0434 3000\u20AE</span>
                </label>
                <label class="plan-card">
                  <input type="radio" name="paymentPlan" value="two-months">
                  <span>2 \u0441\u0430\u0440\u0434 5000\u20AE</span>
                </label>
                <label class="plan-card">
                  <input type="radio" name="paymentPlan" value="two-weeks">
                  <span>14 \u0445\u043E\u043D\u043E\u0433\u0442 2000\u20AE</span>
                </label>
              </div>
            </div>

            <div class="block">
              <h4>\u0422\u04E9\u043B\u0431\u04E9\u0440\u0438\u0439\u043D \u0430\u0440\u0433\u0430</h4>
              <div class="method-grid">
                <label class="method-card">
                  <input type="radio" name="paymentMethod" value="card" checked>
                  <span>\u041A\u0430\u0440\u0442\u0430\u0430\u0440 \u0442\u04E9\u043B\u04E9\u0445</span>
                </label>
                <label class="method-card">
                  <input type="radio" name="paymentMethod" value="qpay">
                  <span>QPay-\u0440 \u0442\u04E9\u043B\u04E9\u0445</span>
                </label>
              </div>

              <div class="payment-details payment-details--card">
                <div class="form-group">
                  <label for="cardNumber">\u041A\u0430\u0440\u0442\u044B\u043D \u0434\u0443\u0433\u0430\u0430\u0440</label>
                  <input id="cardNumber" type="text" inputmode="numeric" placeholder="0000 0000 0000 0000">
                </div>
                <div class="form-row">
                  <div class="form-group">
                    <label for="cardExp">\u0414\u0443\u0443\u0441\u0430\u0445 \u0445\u0443\u0433\u0430\u0446\u0430\u0430</label>
                    <input id="cardExp" type="text" placeholder="MM/YY">
                  </div>
                  <div class="form-group">
                    <label for="cardCvv">CVV</label>
                    <input id="cardCvv" type="password" inputmode="numeric" placeholder="***">
                  </div>
                </div>
              </div>

              <div class="payment-details payment-details--qpay" hidden>
                <div class="qpay-box">
                  <div class="qpay-qr">QR</div>
                  <div>
                    <strong>QPay \u0442\u04E9\u043B\u0431\u04E9\u0440</strong>
                    <p>QR \u043A\u043E\u0434 \u0443\u043D\u0448\u0443\u0443\u043B\u0436 \u0442\u04E9\u043B\u043D\u04E9 \u04AF\u04AF.</p>
                  </div>
                </div>
              </div>

              <div class="actions">
                <button class="btn-pay" type="button">\u0422\u04E9\u043B\u0431\u04E9\u0440 \u0442\u04E9\u043B\u04E9\u0445</button>
                <button class="btn-go" type="button" hidden>\u0425\u04AF\u0440\u0433\u044D\u043B\u0442 \u0440\u04AF\u04AF \u043E\u0440\u043E\u0445</button>
                <p class="status" hidden>\u2705 \u0422\u04E9\u043B\u0431\u04E9\u0440 \u0442\u04E9\u043B\u04E9\u0433\u0434\u0441\u04E9\u043D.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;let l=this.querySelector(".btn-close"),c=this.querySelector(".btn-pay"),u=this.querySelector(".btn-go"),m=this.querySelector(".status"),y=this.querySelectorAll('input[name="paymentMethod"]'),w=()=>{m&&(m.hidden=!1),c&&(c.disabled=!0,c.textContent="\u0422\u04E9\u043B\u0431\u04E9\u0440 \u0442\u04E9\u043B\u04E9\u0433\u0434\u0441\u04E9\u043D"),u&&(u.hidden=!1)},k=()=>{m&&(m.hidden=!0),c&&(c.disabled=!1,c.textContent="\u0422\u04E9\u043B\u0431\u04E9\u0440 \u0442\u04E9\u043B\u04E9\u0445"),u&&(u.hidden=!0)},b=()=>{let p=this.querySelector('input[name="paymentMethod"]:checked')?.value||"card",f=this.querySelector(".payment-details--card"),g=this.querySelector(".payment-details--qpay");f&&(f.hidden=p!=="card"),g&&(g.hidden=p!=="qpay")};l?.addEventListener("click",()=>location.hash="#profile"),y.forEach(p=>p.addEventListener("change",b)),b(),localStorage.setItem("courierPaid",d()?"1":"0"),d()?w():k(),c?.addEventListener("click",()=>{localStorage.setItem(n,"1"),localStorage.setItem("courierPaid","1"),w(),window.dispatchEvent(new Event("user-updated"))}),u?.addEventListener("click",()=>{location.hash="#delivery"})}};customElements.define("pay-page",j);var F=class extends HTMLElement{connectedCallback(){this.currentMode="login",this.currentRole="customer",this.innerHTML=`
      <div class="card" role="dialog" aria-labelledby="login-title">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">
          <div style="width:18px"></div>
          <strong id="login-title">\u0411\u04AF\u0440\u0442\u0433\u04AF\u04AF\u043B\u044D\u0445</strong>
          
          <div class="close">\u2715</div>
        </div>

        <div class="auth-tabs" role="tablist" aria-label="\u041D\u044D\u0432\u0442\u0440\u044D\u0445 \u044D\u0441\u0432\u044D\u043B \u0431\u04AF\u0440\u0442\u0433\u04AF\u04AF\u043B\u044D\u0445">
          <button class="tab-btn is-active" type="button" data-mode="login" role="tab" aria-selected="true">
            \u041D\u044D\u0432\u0442\u0440\u044D\u0445
          </button>
          <button class="tab-btn" type="button" data-mode="register" role="tab" aria-selected="false">
            \u0411\u04AF\u0440\u0442\u0433\u04AF\u04AF\u043B\u044D\u0445
          </button>
        </div>

        <div class="login-tabs-row">
          <div class="subtitle">
            \u041D\u044D\u0440 \u0431\u043E\u043B\u043E\u043D \u043D\u0443\u0443\u0446 \u04AF\u0433\u044D\u044D \u0430\u0448\u0438\u0433\u043B\u0430\u043D \u043D\u044D\u0432\u0442\u044D\u0440\u043D\u044D.
          </div>
           <div class="login-tabs register-only" role="tablist" aria-label="\u0411\u04AF\u0440\u0442\u0433\u044D\u043B\u0438\u0439\u043D \u0442\u04E9\u0440\u04E9\u043B">
            <button class="tab-btn is-active" type="button" data-role="customer" role="tab" aria-selected="true" aria-label="\u0425\u044D\u0440\u044D\u0433\u043B\u044D\u0433\u0447\u044D\u044D\u0440">
              \u0425\u044D\u0440\u044D\u0433\u043B\u044D\u0433\u0447\u044D\u044D\u0440
            </button>
            <button class="tab-btn" type="button" data-role="courier" role="tab" aria-selected="false" aria-label="\u0425\u04AF\u0440\u0433\u044D\u0433\u0447\u044D\u044D\u0440">
              \u0425\u04AF\u0440\u0433\u044D\u0433\u0447\u044D\u044D\u0440
            </button>
          </div>
        </div>
        <form class="auth-layout">
          <input class="register-only" type="hidden" name="role" value="customer">
          <div class="form-group register-only">
            <label for="name">\u041D\u044D\u0440</label>
            <input id="name" name="name" type="text" placeholder="\u041D\u044D\u0440">
          </div>
          <div class="form-group">
            <label for="phone">\u0423\u0442\u0430\u0441\u043D\u044B \u0434\u0443\u0433\u0430\u0430\u0440</label>
            <input id="phone" name="phone" type="tel" placeholder="\u0423\u0442\u0430\u0441\u043D\u044B \u0434\u0443\u0433\u0430\u0430\u0440" required>
          </div>
          <div class="form-group register-only">
            <label for="studentId">ID</label>
            <input id="studentId" name="studentId" type="text" placeholder="ID">
          </div>
          <div class="form-group">
            <label for="password">\u041D\u0443\u0443\u0446 \u04AF\u0433</label>
            <input id="password" name="password" type="password" placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" required>
          </div>

          <button class="continue-btn" type="submit">\u0411\u04AF\u0440\u0442\u0433\u04AF\u04AF\u043B\u044D\u0445</button>

          <div class="privacy">\u041D\u0443\u0443\u0446\u043B\u0430\u043B\u044B\u043D \u0431\u043E\u0434\u043B\u043E\u0433\u043E</div>

          <div class="or">\u044D\u0441\u0432\u044D\u043B</div>

          <div class="social">
            <button type="button" class="btn-social">
              <img src="assets/img/num-logo.svg" alt="num-logo">
              SISI-\u044D\u044D\u0440 \u04AF\u0440\u0433\u044D\u043B\u0436\u043B\u04AF\u04AF\u043B\u044D\u0445
            </button>
          </div>
          </form>
      </div>
  <div class="scene">
    <div class="delivery-man">
      <div class="head"></div>
      <div class="body"></div>

      <div class="arm left"></div>
      <div class="arm right"></div>

      <div class="leg left"></div>
      <div class="leg right"></div>

      <div class="box">\u{1F4E6}</div>
    </div>
  </div>
    `;let e=this.querySelector("form"),t=this.querySelector(".close"),r=this.querySelector("input[name='role']"),i=this.querySelectorAll(".auth-tabs .tab-btn"),s=this.querySelectorAll(".login-tabs .tab-btn"),a=this.querySelector(".login-tabs"),n=this.querySelector("#login-title"),d=this.querySelector(".continue-btn"),l=this.querySelector(".subtitle"),c=this.querySelector("#name"),u=this.querySelector("#phone"),m=this.querySelector("#studentId"),y=this.querySelectorAll(".register-only");t&&t.addEventListener("click",()=>{location.hash="#home"}),i.forEach(b=>{b.addEventListener("click",()=>{let p=b.getAttribute("data-mode")||"login";this.currentMode=p,i.forEach(g=>{let M=g===b;g.classList.toggle("is-active",M),g.setAttribute("aria-selected",M?"true":"false")});let f=p==="register";y.forEach(g=>{g.style.display=f?"":"none"}),f&&r&&(r.value=this.currentRole),c&&(c.required=f),m&&(m.required=!1),u&&(u.required=!0),n&&(n.textContent=f?"\u0411\u04AF\u0440\u0442\u0433\u04AF\u04AF\u043B\u044D\u0445":"\u041D\u044D\u0432\u0442\u0440\u044D\u0445"),d&&(d.textContent=f?this.currentRole==="courier"?"\u0425\u04AF\u0440\u0433\u044D\u0433\u0447\u044D\u044D\u0440 \u0431\u04AF\u0440\u0442\u0433\u04AF\u04AF\u043B\u044D\u0445":"\u0425\u044D\u0440\u044D\u0433\u043B\u044D\u0433\u0447\u044D\u044D\u0440 \u0431\u04AF\u0440\u0442\u0433\u04AF\u04AF\u043B\u044D\u0445":"\u041D\u044D\u0432\u0442\u0440\u044D\u0445"),l&&(l.textContent=f?"\u041D\u044D\u0440 \u0431\u043E\u043B\u043E\u043D \u043D\u0443\u0443\u0446 \u04AF\u0433\u044D\u044D \u0430\u0448\u0438\u0433\u043B\u0430\u043D \u043D\u044D\u0432\u0442\u044D\u0440\u043D\u044D.":"\u0423\u0442\u0430\u0441\u043D\u044B \u0434\u0443\u0433\u0430\u0430\u0440, \u043D\u0443\u0443\u0446 \u04AF\u0433\u044D\u044D \u043E\u0440\u0443\u0443\u043B\u043D\u0430 \u0443\u0443.")})}),s.forEach(b=>{b.addEventListener("click",()=>{let p=b.getAttribute("data-role")||"customer";this.currentRole=p,a&&(a.dataset.activeRole=p),s.forEach(f=>{let g=f===b;f.classList.toggle("is-active",g),f.setAttribute("aria-selected",g?"true":"false")}),r&&(r.value=p),n&&(n.textContent="\u0411\u04AF\u0440\u0442\u0433\u04AF\u04AF\u043B\u044D\u0445"),d&&(d.textContent=p==="courier"?"\u0425\u04AF\u0440\u0433\u044D\u0433\u0447\u044D\u044D\u0440 \u0431\u04AF\u0440\u0442\u0433\u04AF\u04AF\u043B\u044D\u0445":"\u0425\u044D\u0440\u044D\u0433\u043B\u044D\u0433\u0447\u044D\u044D\u0440 \u0431\u04AF\u0440\u0442\u0433\u04AF\u04AF\u043B\u044D\u0445")})});let w=localStorage.getItem("login_prefill_mode"),k=localStorage.getItem("login_prefill_role");w&&(this.currentMode=w==="register"?"register":"login",localStorage.removeItem("login_prefill_mode")),k&&(this.currentRole=k==="courier"?"courier":"customer",localStorage.removeItem("login_prefill_role")),y.length&&y.forEach(b=>{b.style.display=this.currentMode==="register"?"":"none"}),a&&(a.dataset.activeRole=this.currentRole),r&&(r.value=this.currentRole),n&&(n.textContent=this.currentMode==="register"?"\u0411\u04AF\u0440\u0442\u0433\u04AF\u04AF\u043B\u044D\u0445":"\u041D\u044D\u0432\u0442\u0440\u044D\u0445"),d&&(d.textContent=this.currentMode==="register"?this.currentRole==="courier"?"\u0425\u04AF\u0440\u0433\u044D\u0433\u0447\u044D\u044D\u0440 \u0431\u04AF\u0440\u0442\u0433\u04AF\u04AF\u043B\u044D\u0445":"\u0425\u044D\u0440\u044D\u0433\u043B\u044D\u0433\u0447\u044D\u044D\u0440 \u0431\u04AF\u0440\u0442\u0433\u04AF\u04AF\u043B\u044D\u0445":"\u041D\u044D\u0432\u0442\u0440\u044D\u0445"),l&&(l.textContent=this.currentMode==="register"?"\u041D\u044D\u0440 \u0431\u043E\u043B\u043E\u043D \u043D\u0443\u0443\u0446 \u04AF\u0433\u044D\u044D \u0430\u0448\u0438\u0433\u043B\u0430\u043D \u043D\u044D\u0432\u0442\u044D\u0440\u043D\u044D.":"\u0423\u0442\u0430\u0441\u043D\u044B \u0434\u0443\u0433\u0430\u0430\u0440, \u043D\u0443\u0443\u0446 \u04AF\u0433\u044D\u044D \u043E\u0440\u0443\u0443\u043B\u043D\u0430 \u0443\u0443."),c&&(c.required=this.currentMode==="register"),e&&e.addEventListener("submit",async b=>{b.preventDefault();let p=this.querySelector("#password")?.value?.trim()||"",f=this.currentMode==="register",g=f&&(r?.value||"customer")==="courier",M=this.querySelector("#name")?.value?.trim()||"",oe=this.querySelector("#phone")?.value?.trim()||"",de=this.querySelector("#studentId")?.value?.trim()||"",le=r?.value||this.currentRole||"customer",q=f&&le==="courier"?"courier":"customer",xe=M.trim()||"\u0417\u043E\u0447\u0438\u043D \u0445\u044D\u0440\u044D\u0433\u043B\u044D\u0433\u0447";try{let L=await h("/api/auth/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:xe,phone:oe,studentId:de,role:q,password:p,mode:this.currentMode})});if(!L.ok){let T=await L.json().catch(()=>({}));throw new Error(T.error||"\u041D\u044D\u0432\u0442\u0440\u044D\u0445 \u04AF\u0435\u0434 \u0430\u043B\u0434\u0430\u0430 \u0433\u0430\u0440\u043B\u0430\u0430")}let E=await L.json(),x=(E?.user?.role||E?.role||le||q||"customer")==="courier"?"courier":"customer",ce=String(E?.user?.phone||oe||"").trim(),he=String(E?.user?.student_id||E?.user?.studentId||de||"").trim(),$=(he||ce).trim();if(localStorage.setItem("authLoggedIn","1"),localStorage.setItem("authRole",x),localStorage.setItem("authPhone",ce),localStorage.setItem("authStudentId",he),localStorage.setItem("authUserKey",$),x==="courier"&&$){let T=`courierPaid:${$}`,Me=localStorage.getItem(T)==="1"?"1":"0";localStorage.setItem("courierPaid",Me)}else localStorage.setItem("courierPaid","0");q==="courier"?localStorage.getItem("courierPaid")!=="1"&&localStorage.setItem("courierPaid","0"):localStorage.setItem("courierPaid","0"),window.dispatchEvent(new Event("user-updated"));let ke=localStorage.getItem("pendingOrderDraft");location.hash=ke?"#home":"#profile";return}catch(L){let E=String(L?.message||"");if(E.includes("users_phone_key")){alert("\u042D\u043D\u044D \u0443\u0442\u0430\u0441 \u0431\u04AF\u0440\u0442\u0433\u044D\u043B\u0442\u044D\u0439 \u0431\u0430\u0439\u043D\u0430. \u041D\u044D\u0432\u0442\u0440\u044D\u0445 \u0433\u043E\u0440\u0438\u043C\u043E\u043E\u0440 \u043E\u0440\u043D\u043E \u0443\u0443.");let x=this.querySelector('.auth-tabs .tab-btn[data-mode="login"]');x&&x.click();return}alert(E||"\u041D\u044D\u0432\u0442\u0440\u044D\u0445 \u04AF\u0435\u0434 \u0430\u043B\u0434\u0430\u0430 \u0433\u0430\u0440\u043B\u0430\u0430")}})}normalizeName(e){let t=String(e||"").trim();if(!t)return"\u0417\u043E\u0447\u0438\u043D \u0445\u044D\u0440\u044D\u0433\u043B\u044D\u0433\u0447";let r=t.split(/\s+/).filter(i=>i&&i.length>1);return r.length?r.join(" "):t}};customElements.define("login-page",F);var J=class extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this._timer=null}connectedCallback(){this.render(),this.updateToNow(),this.startAutoUpdate()}disconnectedCallback(){clearInterval(this._timer)}render(){this.shadowRoot.innerHTML=`
      <style>
        :host {
          display: flex;
          gap: 0.5rem;
          flex: 1 1 auto;
        }

        .date-time-picker {
          display: flex;
          gap: 0.5rem;
          width: 100%;
          font-family: var(--font-family);
        }
      
        .wrapper {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0 0.75rem;
          height: 2.75rem;
          border: 0.0625rem solid var(--color-border);
          border-radius: var(--radius);
          transition: all 0.25s ease;
          background: var(--color-bg);
          flex: 1 1 0;
          min-width: 0;
          font-family: var(--font-family);
        }

        input {
          border: none;
          outline: none;
          background: transparent;
          width: 100%;
          font-size: var(--font-size-base, 0.875rem);
          font-family: var(--font-family);
          cursor: pointer;
          color: var(--color-text);
        }

        .wrapper:has(input:focus) {
          border-color: var(--color-accent, #d00);
          box-shadow: 0 0 0 0.15rem rgba(201, 13, 48, 0.18);
        }

        input[type="date"],
        input[type="time"] {
          accent-color: var(--color-accent, #d00);
          background-color: transparent;
        }

        input::-webkit-calendar-picker-indicator {
          cursor: pointer;
        }

        @media (prefers-color-scheme: dark) {
          input[type="date"],
          input[type="time"] {
            color-scheme: dark;
            background-color: var(--color-bg);
          }
        }

        @media (max-width: 54rem) {
          :host {
            gap: 0.5rem;
          }
          
          .date-time-picker {
            gap: 0.5rem;
          }
          
          .wrapper {
            padding: 0 0.625rem;
            gap: 0.375rem;
          }
        }
      </style>
      
      <div class="date-time-picker">
        <div class="wrapper">
          <input class="date" type="date" aria-label="\u041E\u0433\u043D\u043E\u043E \u0441\u043E\u043D\u0433\u043E\u0445">
        </div>
        <div class="wrapper">
          <input class="time" type="time" aria-label="\u0426\u0430\u0433 \u0441\u043E\u043D\u0433\u043E\u0445">
        </div>
      </div>
    `}updateToNow(){let e=this.shadowRoot.querySelector(".date"),t=this.shadowRoot.querySelector(".time"),r=new Date,i=r.getFullYear(),s=String(r.getMonth()+1).padStart(2,"0"),a=String(r.getDate()).padStart(2,"0"),n=String(r.getHours()).padStart(2,"0"),d=String(r.getMinutes()).padStart(2,"0");e.value=`${i}-${s}-${a}`,t.value=`${n}:${d}`}startAutoUpdate(){this._timer=setInterval(()=>{this.updateToNow()},1e3*60)}get value(){let e=this.shadowRoot.querySelector(".date").value,t=this.shadowRoot.querySelector(".time").value;return`${e}\u2022${t}`}get iso(){let e=this.shadowRoot.querySelector(".date").value,t=this.shadowRoot.querySelector(".time").value,r=new Date(`${e}T${t}:00`);return isNaN(r.getTime())?null:r.toISOString()}};customElements.define("date-time-picker",J);function be(o){return o>5?1500:o>=2?1e3:o===1?500:0}var z=class extends HTMLElement{constructor(){super(),this.prices={\u041A\u0438\u043C\u0431\u0430\u0431:5500,\u0411\u0443\u0440\u0433\u0435\u0440:6500,\u0411\u0443\u0443\u0437:4e3,\u0421\u0430\u043B\u0430\u0434:3e3,"\u041A\u043E\u043B\u0430 0.5\u043B":2500,"\u0425\u0430\u0440 \u0446\u0430\u0439":1500,\u041A\u043E\u0444\u0435:3e3,"\u0416\u04AF\u04AF\u0441 0.33\u043B":2500}}connectedCallback(){this.render(),this.initializeElements(),this.setupEventListeners(),this.updateTotalsAndCount()}render(){this.innerHTML=`
          <h3>\u0422\u0430\u043D\u044B \u0441\u0430\u0433\u0441</h3>
          <div class="cart-icon">
            <svg><path opacity="0.4" d="M8.26012 21.9703C9.1827 21.9703 9.93865 22.7536 9.93883 23.7213C9.93883 24.6776 9.18281 25.4615 8.26012 25.4615C7.32644 25.4613 6.57066 24.6775 6.57066 23.7213C6.57084 22.7537 7.32655 21.9704 8.26012 21.9703ZM20.767 21.9703C21.6894 21.9704 22.4455 22.7536 22.4457 23.7213C22.4457 24.6775 21.6896 25.4614 20.767 25.4615C19.8331 25.4615 19.0765 24.6776 19.0765 23.7213C19.0767 22.7536 19.8333 21.9703 20.767 21.9703Z" fill="#C90D30"/>
              <path fill-rule="evenodd" clip-rule="evenodd" d="M22.4456 7.31518C23.1237 7.31518 23.5684 7.55713 24.0131 8.08714C24.4577 8.61714 24.5356 9.37757 24.4355 10.0677L23.3794 17.626C23.1793 19.0789 21.9787 20.1493 20.5669 20.1493H8.4385C6.95997 20.1493 5.73713 18.9741 5.61485 17.4543L4.5921 4.89445L2.91348 4.59489C2.46881 4.51423 2.15754 4.06488 2.23535 3.60401C2.31317 3.13162 2.74672 2.82053 3.20251 2.88966L5.85386 3.30445C6.23182 3.37473 6.50974 3.69619 6.54309 4.08793L6.75431 6.66881C6.78766 7.03865 7.0767 7.31518 7.43243 7.31518H22.4456ZM15.7089 13.3053H18.7882C19.2551 13.3053 19.622 12.9136 19.622 12.4412C19.622 11.9573 19.2551 11.5771 18.7882 11.5771H15.7089C15.242 11.5771 14.8751 11.9573 14.8751 12.4412C14.8751 12.9136 15.242 13.3053 15.7089 13.3053Z" fill="#C90D30"/>
            </svg>
            <span>0</span>
          </div>

          <div class="cart-content">
            <div></div>
            <div class="delivery-box">
              <p><b>\u0425\u04AF\u0440\u0433\u044D\u043B\u0442:</b></p>
              <img src="assets/img/box.svg" alt="delivery" width="57" height="57" decoding="async">
              <p>1500\u20AE</p>
            </div>

            <div class="total-box">
              <p><b>\u041D\u0438\u0439\u0442:</b></p>
              <p class="total-price">0\u20AE</p>
            </div>
          </div>
        `}initializeElements(){if(this.totalPriceEl=this.querySelector(".total-price"),this.deliveryPriceEl=this.querySelector(".delivery-box p:last-child"),this.cartItemsContainer=this.querySelector(".cart-content > div:first-child"),this.cartBadge=this.querySelector(".cart-icon span"),this.foodSelect=document.querySelector("#what")||document.querySelector(".bottom-row select"),this.deliveryImgEl=this.querySelector(".delivery-box img"),!this.cartItemsContainer){let e=this.querySelector(".cart-content");if(e){let t=document.createElement("div");e.insertBefore(t,e.firstChild),this.cartItemsContainer=t}}}setupEventListeners(){this.foodSelect&&this.foodSelect.addEventListener("change",e=>{let t=e.target.selectedOptions?.[0];if(!t)return;let r=(t.dataset.name||t.textContent||"").split(" \u2014 ")[0].trim(),i=Number(t.dataset.price||0),s=e.target.selectedOptions&&e.target.selectedOptions[0].dataset.img?e.target.selectedOptions[0].dataset.img:"";this.addItemToCart(r,i,s),e.target.selectedIndex=0}),this.cartItemsContainer&&this.cartItemsContainer.addEventListener("click",e=>{let t=e.target.closest("svg.del-btn");if(!t)return;let r=t.closest(".item-box");if(!r)return;let i=parseInt(r.dataset.qty||(r.querySelector("p")?.textContent.match(/(\d+)/)||[0,1])[1],10)||1,s=parseInt(r.dataset.price||this.parsePrice(r.querySelector(".price").textContent)/Math.max(i,1),10)||0;if(i>1){let a=i-1;r.dataset.qty=String(a),r.querySelector("p").innerHTML=`<b>${this.escapeHtml(r.querySelector("b").textContent)}</b><br>${a} \u0448\u0438\u0440\u0445\u044D\u0433`,r.querySelector(".price").textContent=this.formatPrice(s*a)}else r.remove();this.updateTotalsAndCount()})}addItemToCart(e,t,r=""){if(!e)return;let s=[...this.cartItemsContainer.querySelectorAll(".item-box")].find(d=>{let l=d.querySelector("b");return l&&l.textContent.trim()===e});if(s){let l=(parseInt(s.dataset.qty||"1",10)||1)+1,c=parseInt(s.dataset.price||t,10)||t;s.dataset.qty=String(l),s.dataset.price=String(c),s.querySelector("p").innerHTML=`<b>${this.escapeHtml(e)}</b><br>${l} \u0448\u0438\u0440\u0445\u044D\u0433`,s.querySelector(".price").textContent=this.formatPrice(c*l),this.updateTotalsAndCount();return}let a=document.createElement("div");a.className="item-box",a.dataset.qty="1",a.dataset.price=String(t);let n=r?`<img class="item-img" src="${this.escapeAttr(r)}" alt="${this.escapeAttr(e)}">`:"";a.innerHTML=`
            ${n}
            <p><b>${this.escapeHtml(e)}</b><br>1 \u0448\u0438\u0440\u0445\u044D\u0433</p>
            <p class="price">${this.formatPrice(t)}</p>
            <svg class="del-btn" viewBox="0 0 20 20" width="18" height="18" role="button" aria-label="remove">
                <path d="M5.5415 15.75C5.10609 15.75 4.73334 15.6031 4.42327 15.3094C4.11321 15.0156 3.95817 14.6625 3.95817 14.25V4.5H3.1665V3H7.12484V2.25H11.8748V3H15.8332V4.5H15.0415V14.25C15.0415 14.6625 14.8865 15.0156 14.5764 15.3094C14.2663 15.6031 13.8936 15.75 13.4582 15.75H5.5415Z" fill="#C7C4CD"/>
            </svg>`,this.cartItemsContainer.appendChild(a),this.updateTotalsAndCount()}updateTotalsAndCount(){let e=[...this.cartItemsContainer?this.cartItemsContainer.querySelectorAll(".item-box"):[]],t=0,r=0,i=[];e.forEach(l=>{let c=parseInt(l.dataset.qty||(l.querySelector("p")?.textContent.match(/(\d+)/)||[0,1])[1],10)||1,u=parseInt(l.dataset.price||this.parsePrice(l.querySelector(".price").textContent)/Math.max(c,1),10)||0;t+=u*c,r+=c;let m=l.querySelector("b")?.textContent?.trim()||"";i.push({name:m,qty:c,price:u,unitPrice:u})});let s=be(r),a=t>0?this.formatPrice(s):"0\u20AE";this.deliveryPriceEl&&(this.deliveryPriceEl.textContent=a);let n=t>0?t+s:0;this.totalPriceEl&&(this.totalPriceEl.textContent=this.formatPrice(n)),this.cartBadge&&(this.cartBadge.textContent=String(r));let d=O(r);this.deliveryImgEl&&(this.deliveryImgEl.src=d,this.deliveryImgEl.alt=`delivery tier ${r}`),this.style.display=r===0?"none":"block",this.summary={items:i,itemsTotal:t,deliveryFee:s,total:n,totalQty:r,deliveryIcon:d}}parsePrice(e){return parseInt(String(e||"").replace(/[^\d]/g,""),10)||0}formatPrice(e){return Number(e).toLocaleString("mn-MN")+"\u20AE"}getSummary(){return this.summary||{items:[],itemsTotal:0,deliveryFee:0,total:0,totalQty:0}}escapeAttr(e){return String(e||"").replace(/"/g,"&quot;").replace(/</g,"&lt;")}escapeHtml(e){return String(e||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}};window.customElements.define("sh-cart",z);var V=class extends HTMLElement{static get observedAttributes(){return["thumb","title","meta","price","sub","customer","order-id"]}connectedCallback(){this._ready||(this._ready=!0,this.render(),this.setupEvents())}attributeChangedCallback(){this._ready&&this.render()}get data(){return{thumb:this.getAttribute("thumb")||"assets/img/box.svg",title:this.getAttribute("title")||"",meta:this.getAttribute("meta")||"",price:this.getAttribute("price")||"",orderId:this.getAttribute("order-id")||"",sub:this.parseJSON(this.getAttribute("sub")||"[]"),customer:this.parseJSON(this.getAttribute("customer")||"{}")}}parseJSON(e){try{return JSON.parse(e)}catch{return e.startsWith("[")?[]:{}}}render(){let e=this.data,t=e.thumb,r=e.title,i=e.meta,s=e.price;this.innerHTML=`
      <article class="offer-card" role="button" tabindex="0">
        <div class="offer-thumb">
          <img 
            src="${t}" 
            alt="icon" 
            width="57" 
            height="57" 
            decoding="async"
          />
        </div>
        <div class="offer-info">
          <div class="offer-title">${r}</div>
          <div class="offer-meta">${i}</div>
        </div>
        <div class="offer-price">${s}</div>
      </article>
    `}setupEvents(){this.addEventListener("click",()=>{this.sendSelectEvent()}),this.addEventListener("keydown",e=>{let t=e.key==="Enter",r=e.key===" ";(t||r)&&(e.preventDefault(),this.click())})}sendSelectEvent(){let e=this.data,t=new CustomEvent("offer-select",{bubbles:!0,detail:e});this.dispatchEvent(t)}};customElements.get("offer-card")||customElements.define("offer-card",V);var Z=class extends HTMLElement{connectedCallback(){this._ready||(this._ready=!0,this._loaded=!1,this.handleRouteChange=()=>{this.onRouteChange()},this.renderList(),this.handleOffersUpdated=()=>Se(),window.addEventListener("offers-updated",this.handleOffersUpdated),window.addEventListener("hashchange",this.handleRouteChange),this.addEventListener("offer-select",this.handleOfferSelect),this.handleRouteChange())}disconnectedCallback(){this.handleOffersUpdated&&window.removeEventListener("offers-updated",this.handleOffersUpdated),window.removeEventListener("hashchange",this.handleRouteChange),this.removeEventListener("offer-select",this.handleOfferSelect)}renderList(){this.innerHTML=`
      <section class="offers-container">
        <div class="offers-row"></div>
      </section>
    `}set items(e){this.renderItems(e)}renderItems(e){let t=this.querySelector(".offers-row");if(t){if(!e||e.length===0){t.innerHTML='<p style="text-align: center; padding: 2rem;">\u041E\u0434\u043E\u043E\u0433\u043E\u043E\u0440 \u0441\u0430\u043D\u0430\u043B\u0433\u04AF\u0439 \u0431\u0430\u0439\u043D\u0430</p>';return}t.innerHTML=e.map($e).join("")}}handleOfferSelect(e){let t=document.querySelector("offer-modal");if(!t){console.warn("offer-modal \u043E\u043B\u0434\u0441\u043E\u043D\u0433\u04AF\u0439");return}t.show(e.detail)}onRouteChange(){let e=location.hash;if(e!=="#home"&&e!==""||this._loaded===!0)return;this._loaded=!0;let t=Ne();this.renderItems(t),Se()}};customElements.get("offers-list")||customElements.define("offers-list",Z);function $e(o){let e=o.thumb||"assets/img/document.svg",t=o.title||"",r=o.meta||"",i=o.price||"",s=o.orderId||o.id||"",a=v(JSON.stringify(o.sub||[])),n=v(JSON.stringify(o.customer||{}));return`
    <offer-card
      thumb="${e}"
      title="${t}"
      meta="${r}"
      sub="${a}"
      price="${i}"
      order-id="${s}"
      customer="${n}">
    </offer-card>
  `}function we(o){try{let e=String(o).split("\u2022"),[t,r]=e,[i,s,a]=t.split("/"),[n,d]=r.split(":"),l=2e3+Number.parseInt(a,10);return new Date(l,Number(i)-1,Number(s),Number(n),Number(d))}catch{}}function Ce(o){let e=o?.scheduled_at;if(!e)return null;let t=Date.parse(e);if(!isNaN(t))return t;let r=we(e);return r?r.getTime():null}function Te(o){let e=Ce(o);return e?e<Date.now():!0}function Re(o){let e=o?.from_name||"",t=o?.to_name||"";return[e,t].filter(r=>r!=="").join(" - ")}function _e(o){return o.filter(e=>{let t=e?.status;return t==="delivered"||t==="cancelled"||e?.courier?!1:!Te(e)}).map(e=>{let t=e?.items||[],r=t.reduce((a,n)=>a+(n?.qty??0),0),i=t.map(a=>({name:`${a?.name||"\u0411\u0430\u0440\u0430\u0430"} x${a?.qty||1}`})),s=Ce(e);return{orderId:e?.id||"",title:Re(e),meta:I(s),price:S(e?.total_amount),thumb:O(r),customer:e?.customer,sub:i}})}async function He(){try{let o=await h("/api/orders");if(!o.ok)return console.error("\u0421\u0430\u043D\u0430\u043B\u0443\u0443\u0434 \u0442\u0430\u0442\u0430\u0445\u0430\u0434 \u0430\u043B\u0434\u0430\u0430:",o.status),[];let e=await o.json();return _e(e)}catch{}}function Ne(){let o=localStorage.getItem("offers");if(!o)return[];try{return JSON.parse(o)||[]}catch{}}function De(o){let e=localStorage.getItem("authUserKey");return e?`${o}:${e}`:o}function Ue(){let o=De("removed_offer_ids"),e=localStorage.getItem(o);if(!e)return[];try{return JSON.parse(e)||[]}catch{}}function Pe(o){let e=Ue();return e.length?o.filter(t=>{let r=t?.orderId??t?.id??null;return r?!e.includes(String(r)):!0}):o}function Be(o){return o.filter(e=>{if(!e?.meta)return!0;let t=we(e.meta);return t?t.getTime()>=Date.now():!0})}async function Se(){let o=[];try{o=await He()}catch{}o=Be(o),console.log("\u0425\u0443\u0433\u0430\u0446\u0430\u0430 \u0434\u0443\u0443\u0441\u0441\u0430\u043D \u0445\u0430\u0441\u0441\u0430\u043D\u044B \u0434\u0430\u0440\u0430\u0430:",o.length),o=Pe(o),console.log("\u0423\u0441\u0442\u0433\u0430\u0441\u0430\u043D \u0445\u0430\u0441\u0441\u0430\u043D\u044B \u0434\u0430\u0440\u0430\u0430:",o.length),localStorage.setItem("offers",JSON.stringify(o)),document.querySelectorAll("offers-list").forEach(e=>{e.items=o})}var K=class extends HTMLElement{connectedCallback(){this.render(),this.getElements(),this.setupEventListeners(),this.checkViewportSize(),this.loadCartItems()}disconnectedCallback(){this.removeEventListeners()}render(){this.innerHTML=`
      <div class="delivery-cart">
        <div class="delivery-cart__header">
          <h3>\u0425\u04AF\u0440\u0433\u044D\u043B\u0442\u0438\u0439\u043D \u0441\u0430\u0433\u0441</h3>
          <span class="delivery-cart__count">0</span>
        </div>
        
        <div class="delivery-cart__list"></div>
        
        <div class="delivery-cart__empty">
          \u041E\u0434\u043E\u043E\u0433\u043E\u043E\u0440 \u0445\u04AF\u0440\u0433\u044D\u043B\u0442 \u0441\u043E\u043D\u0433\u043E\u043E\u0433\u04AF\u0439 \u0431\u0430\u0439\u043D\u0430.
        </div>
        
        <button class="delivery-cart__go">
          \u0425\u04AF\u0440\u0433\u044D\u043B\u0442 \u0440\u04AF\u04AF
        </button>
      </div>
    `}getElements(){this.listEl=this.querySelector(".delivery-cart__list"),this.emptyEl=this.querySelector(".delivery-cart__empty"),this.countEl=this.querySelector(".delivery-cart__count"),this.goBtn=this.querySelector(".delivery-cart__go")}setupEventListeners(){this.handleClickEvent=e=>this.onCartClick(e),this.addEventListener("click",this.handleClickEvent),this.handleCartUpdate=()=>this.loadCartItems(),window.addEventListener("delivery-cart-updated",this.handleCartUpdate),this.handleHashChange=()=>this.loadCartItems(),window.addEventListener("hashchange",this.handleHashChange),this.mediaQuery=window.matchMedia("(max-width: 54rem)"),this.handleMediaChange=()=>this.checkViewportSize(),this.mediaQuery.addEventListener("change",this.handleMediaChange)}removeEventListeners(){this.removeEventListener("click",this.handleClickEvent),window.removeEventListener("delivery-cart-updated",this.handleCartUpdate),window.removeEventListener("hashchange",this.handleHashChange),this.mediaQuery&&this.mediaQuery.removeEventListener("change",this.handleMediaChange)}checkViewportSize(){this.isMobileDevice=this.mediaQuery?.matches===!0,this.loadCartItems()}loadCartItems(){if((location.hash||"#home")==="#home"){if(this.isMobileDevice){this.hideCartDisplay();return}this.fetchCartItemsFromServer()}}async fetchCartItemsFromServer(){try{let e=await h("/api/delivery-cart");if(!e.ok)this.items=[];else{let t=await e.json();this.items=Array.isArray(t?.items)?t.items:[]}}catch{this.items=[]}this.displayCartItems()}displayCartItems(){if(!this.listEl)return;let e=Array.isArray(this.items)?this.items:[];if(this.listEl.innerHTML="",e.length===0){this.hideCartDisplay();return}this.showCartDisplay();let t=0;e.forEach(r=>{let i=Number(r.qty||1);t+=i;let s=ve(r.price),a=this.createSubtitleText(r.sub),n=document.createElement("div");n.className="delivery-cart__item",n.dataset.id=r.id||"",n.innerHTML=`
        <div class="delivery-cart__thumb">
          <img src="${v(r.thumb||"assets/img/box.svg")}" alt="" width="57" height="57" decoding="async">
        </div>

        <div class="delivery-cart__info">
          <div class="delivery-cart__title">${C(r.title||"")}</div>
          <div class="delivery-cart__meta">${C(r.meta||"")}</div>
          <div class="delivery-cart__sub">${C(a)}</div>
        </div>

        <div class="delivery-cart__price">
          <span>${S(s*i)}</span>
          <button class="delivery-cart__remove" type="button" data-action="remove">\u2212</button>
          <span class="delivery-cart__qty">x${i}</span>
        </div>
      `,this.listEl.appendChild(n)}),this.countEl&&(this.countEl.textContent=String(t))}createSubtitleText(e){let r=(Array.isArray(e)?e:[]).map(i=>i?.name).filter(Boolean);return r.length>0?r.join(", "):"\u0411\u0430\u0440\u0430\u0430 \u0430\u043B\u0433\u0430"}onCartClick(e){if(e.target.closest(".delivery-cart__go")){location.hash="#delivery";return}let t=e.target.closest("[data-action='remove']");if(!t)return;let i=t.closest(".delivery-cart__item")?.dataset?.id;i&&this.removeOneItemFromCart(i)}async removeOneItemFromCart(e){try{if(!(await fetch(`/api/delivery-cart/${e}`,{method:"PATCH"})).ok)return}catch{return}this.loadCartItems(),window.dispatchEvent(new Event("delivery-cart-updated"))}showCartDisplay(){this.style.display="block";let e=this.closest(".offers-layout");e&&e.classList.add("has-cart"),this.emptyEl&&(this.emptyEl.style.display="none"),this.goBtn&&(this.goBtn.style.display="inline-flex")}hideCartDisplay(){this.style.display="none";let e=this.closest(".offers-layout");e&&e.classList.remove("has-cart"),this.emptyEl&&(this.emptyEl.style.display="block"),this.countEl&&(this.countEl.textContent="0"),this.goBtn&&(this.goBtn.style.display="none")}};customElements.define("delivery-cart",K);var Q=class extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"})}connectedCallback(){this.render(),this.getElements(),this.setupEvents()}render(){this.shadowRoot.innerHTML=`
      <style>
        :host {
          --accent: #c90d30;
          --radius: 14px;
          --text: #1f2937;
          --muted: #6b7280;
          font-family: "Roboto", "Poppins", sans-serif;
        }
        .modal {
          position: fixed;
          inset: 0;
          display: none;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.45);
          backdrop-filter: blur(6px);
          z-index: 10000;
          padding: 1rem;
        }
        .modal.open { display: flex; }

        .card {
          background: #fff;
          border-radius: var(--radius);
          width: min(540px, 100%);
          box-shadow: 0 22px 60px rgba(0, 0, 0, 0.18);
          padding: 1.35rem 1.5rem;
          position: relative;
          border: 1px solid rgba(0, 0, 0, 0.05);
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
        }

        .title-wrap {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .thumb {
          width: 60px;
          height: 60px;
          border-radius: 14px;
          object-fit: cover;
          background: #f5f6fb;
          box-shadow: inset 0 0 0 1px #eef0f6;
        }

        h2 {
          margin: 0;
          font-size: 1.2rem;
          color: var(--text);
        }

        .meta {
          margin: 0.1rem 0 0;
          color: var(--muted);
          font-size: 0.95rem;
        }

        .close-btn {
          background: transparent;
          border: none;
          font-size: 1.3rem;
          cursor: pointer;
          padding: 0.3rem 0.45rem;
          border-radius: 8px;
          color: var(--muted);
        }
        .close-btn:hover { background: #f3f4f6; }

        .list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
        }
        .list li {
          background: #f8f9fc;
          border-radius: 10px;
          padding: 0.6rem 0.75rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: var(--text);
          border: 1px solid #eef0f6;
        }
        .list span.price {
          font-weight: 700;
        }

        .price-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-weight: 700;
          font-size: 1rem;
          color: var(--text);
        }
        .price-row .pill {
          background: rgba(201, 13, 48, 0.08);
          color: var(--accent);
          padding: 0.3rem 0.75rem;
          border-radius: 999px;
          font-weight: 800;
        }

        .courier {
          border: 1px solid #eef0f6;
          border-radius: 12px;
          padding: 0.75rem 0.85rem;
          background: #f8f9fc;
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 0.7rem;
          align-items: center;
        }
        .courier img {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          object-fit: cover;
          background: #fff;
          border: 1px solid #e5e7eb;
        }
        .courier h4 {
          margin: 0;
          font-size: 1rem;
          color: var(--text);
        }
        .courier p {
          margin: 0.1rem 0 0;
          color: var(--muted);
          font-size: 0.9rem;
        }

        .actions {
          display: flex;
          justify-content: flex-end;
          gap: 0.75rem;
        }

        button {
          font-weight: 600;
          cursor: pointer;
        }

        .delete {
          background: #fff;
          color: var(--muted);
          border-radius: 10px;
          padding: 0.65rem 1.25rem;
          border: 1px solid #e5e7eb;
        }
        .confirm {
          padding: 0.65rem 1.25rem;
          background: var(--accent);
          color: #fff;
          border: none;
          border-radius: 10px;
          font-size: 0.95rem;
          font-weight: 700;
          box-shadow: 0 10px 30px rgba(201, 13, 48, 0.25);
          transition: transform 0.15s ease;
        }
        .confirm:hover { transform: translateY(-1px); }

        @media (prefers-color-scheme: dark) {
          :host {
            --text: #e5e7eb;
            --muted: #9aa4b2;
          }

          .card {
            background: #0f172a;
            border-color: #243040;
            box-shadow: 0 22px 60px rgba(0, 0, 0, 0.45);
          }

          .thumb {
            background: #111827;
            box-shadow: inset 0 0 0 1px #243040;
          }

          .close-btn:hover {
            background: #1f2937;
          }

          .list li {
            background: #111827;
            border-color: #243040;
          }

          .courier {
            background: #111827;
            border-color: #243040;
          }

          .courier img {
            background: #0b0f14;
            border-color: #243040;
          }

          .delete {
            background: #111827;
            color: var(--muted);
            border-color: #243040;
          }
        }
      </style>
      <div class="modal">
        <div class="card">
          <header>
            <div class="title-wrap">
              <img class="thumb" id="thumb" alt="">
              <div>
                <h2 id="title"></h2>
                <p class="meta" id="meta"></p>
              </div>
            </div>
            <button class="close-btn" aria-label="\u0425\u0430\u0430\u0445">\xD7</button>
          </header>

          <div>
            <p class="meta" style="margin:0 0 0.4rem;">\u0411\u0430\u0440\u0430\u0430\u043D\u044B \u0436\u0430\u0433\u0441\u0430\u0430\u043B\u0442</p>
            <ul class="list" id="sub"></ul>
          </div>

          <div class="price-row">
            <span>\u041D\u0438\u0439\u0442 \u04AF\u043D\u044D</span>
            <span class="pill" id="price">0\u20AE</span>
          </div>

          <div>
            <p class="meta" style="margin:0 0 0.4rem;">\u0417\u0430\u0445\u0438\u0430\u043B\u0430\u0433\u0447</p>
            <div class="courier" id="customerCard">
              <img id="customerAvatar" alt="\u0417\u0430\u0445\u0438\u0430\u043B\u0430\u0433\u0447\u0438\u0439\u043D \u0437\u0443\u0440\u0430\u0433" />
              <div>
                <h4 id="customerName"></h4>
                <p id="customerPhone"></p>
                <p id="customerId"></p>
              </div>
            </div>
          </div>

          <div class="actions">
            <button class="delete" type="button">\u0423\u0441\u0442\u0433\u0430\u0445</button>
            <button class="confirm" type="button" data-role="courier-action">\u0425\u04AF\u0440\u0433\u044D\u0445</button>
          </div>
        </div>
      </div>
    `}getElements(){this.modal=this.shadowRoot.querySelector(".modal"),this.card=this.shadowRoot.querySelector(".card"),this.titleEl=this.shadowRoot.getElementById("title"),this.metaEl=this.shadowRoot.getElementById("meta"),this.thumbEl=this.shadowRoot.getElementById("thumb"),this.subEl=this.shadowRoot.getElementById("sub"),this.priceEl=this.shadowRoot.getElementById("price"),this.customerCard=this.shadowRoot.getElementById("customerCard"),this.customerAvatar=this.shadowRoot.getElementById("customerAvatar"),this.customerName=this.shadowRoot.getElementById("customerName"),this.customerPhone=this.shadowRoot.getElementById("customerPhone"),this.customerId=this.shadowRoot.getElementById("customerId"),this.closeBtn=this.shadowRoot.querySelector(".close-btn"),this.deleteBtn=this.shadowRoot.querySelector(".delete"),this.confirmBtn=this.shadowRoot.querySelector(".confirm")}setupEvents(){this.closeBtn.addEventListener("click",()=>this.closeModal()),this.modal.addEventListener("click",e=>{e.target===this.modal&&this.closeModal()}),this.deleteBtn.addEventListener("click",()=>{this.deleteOffer()}),this.confirmBtn.addEventListener("click",()=>this.confirmDelivery())}show(e){if(!this.modal)return;this.currentData=e,this.thumbEl.src=e.thumb,this.thumbEl.alt=e.title,this.titleEl.textContent=e.title,this.metaEl.textContent=e.meta;let t=e.sub;console.log(e.sub),t.length===0?this.subEl.innerHTML='<li><span>\u0411\u0430\u0440\u0430\u0430 \u0430\u043B\u0433\u0430</span><span class="price">-</span></li>':this.subEl.innerHTML=t.map(n=>{let d=n?.name,l=n?.price||"";return console.log(l),`<li><span>${d}</span><span class="price">${l}</span></li>`}).join(""),this.priceEl.textContent=e.price?String(e.price):"0\u20AE";let r=e?.customer||{},i=r?.name||"",s=r?.phone||"",a=r?.student_id||"";this.customerAvatar&&(this.customerAvatar.src=r?.avatar||"assets/img/profile.jpg",this.customerAvatar.alt=i),this.customerName&&(this.customerName.textContent=i),this.customerPhone&&(this.customerPhone.textContent=s),this.customerId&&(this.customerId.textContent=`ID: ${a}`),this.modal.classList.add("open")}closeModal(){this.modal&&this.modal.classList.remove("open")}async confirmDelivery(){if(!this.currentData){this.closeModal();return}if(await this.loadCurrentUser(),!(this.currentUser?.role==="courier")){localStorage.setItem("login_prefill_role","courier"),localStorage.setItem("login_prefill_mode","register"),location.hash="#login";return}let t=this.currentData?.customer||{},r=t?.id||t?.customer_id||null,i=t?.student_id||t?.studentId||null,s=this.currentUser?.id||null,a=this.currentUser?.student_id||this.currentUser?.studentId||null;if(r&&s&&String(r)===String(s)||i&&a&&String(i)===String(a)){alert("\u04E8\u04E9\u0440\u0438\u0439\u043D \u0437\u0430\u0445\u0438\u0430\u043B\u0433\u044B\u0433 \u04E9\u04E9\u0440\u04E9\u04E9 \u0445\u04AF\u0440\u0433\u044D\u0445 \u0431\u043E\u043B\u043E\u043C\u0436\u0433\u04AF\u0439.");return}this.removeFromOffersList(this.currentData);let n=null,d=this.currentData?.orderId;if(d)try{let y=await h(`/api/orders/${d}/assign-courier`,{method:"POST",credentials:"include"});y.ok&&(n=(await y.json())?.order||null)}catch{}if(!await this.addToDeliveryCart(this.currentData)){this.closeModal();return}let c=this.buildActiveOrderData(this.currentData,n);await this.saveActiveOrder(c),window.NumAppState?.setState("courier","delivery_started"),localStorage.setItem("deliveryActive","1"),this.removeFromOffersList(this.currentData);try{let y=await h("/api/courier/me",{credentials:"include"});if(y.ok){let w=await y.json()}}catch(y){console.warn("courier fetch failed",y)}this.closeModal(),window.dispatchEvent(new Event("order-updated")),window.dispatchEvent(new Event("delivery-cart-updated")),window.dispatchEvent(new Event("offers-updated"));let u=document.querySelector("delivery-cart");u&&typeof u.load=="function"&&u.load(),window.matchMedia("(max-width: 30rem)").matches?location.hash="#delivery":console.log("\u0421\u0430\u0433\u0441\u0430\u043D\u0434 \u0430\u043C\u0436\u0438\u043B\u0442\u0442\u0430\u0439 \u043D\u044D\u043C\u044D\u0433\u0434\u043B\u044D\u044D")}async deleteOffer(){if(!this.currentData){this.closeModal();return}await this.loadCurrentUser();let e=this.currentData?.orderId||this.currentData?.id||null;this.checkIfOwner(this.currentData)&&e&&!await this.deleteOrderFromServer(e)||(this.removeFromOffersList(this.currentData),window.dispatchEvent(new Event("offers-updated")),this.closeModal())}checkIfOwnOrder(e){let t=e?.customer||{},r=this.currentUser||{},i=t?.id||t?.customer_id||null,s=t?.student_id||t?.studentId||null,a=r?.id||null,n=r?.student_id||r?.studentId||null;return!!(i&&a&&String(i)===String(a)||s&&n&&String(s)===String(n))}checkIfOwner(e){return this.checkIfOwnOrder(e)}async deleteOrderFromServer(e){try{let t=await h(`/api/orders/${e}`,{method:"DELETE"});if(t.status===401)return location.hash="#login",!1;if(!t.ok){let r=await t.json().catch(()=>({}));return alert(r?.error||"\u0417\u0430\u0445\u0438\u0430\u043B\u0433\u0430 \u0443\u0441\u0442\u0433\u0430\u0445\u0430\u0434 \u0430\u043B\u0434\u0430\u0430 \u0433\u0430\u0440\u043B\u0430\u0430"),!1}return!0}catch{return alert("\u0417\u0430\u0445\u0438\u0430\u043B\u0433\u0430 \u0443\u0441\u0442\u0433\u0430\u0445\u0430\u0434 \u0430\u043B\u0434\u0430\u0430 \u0433\u0430\u0440\u043B\u0430\u0430"),!1}}async addToDeliveryCart(e){let t={title:e.title||"",meta:e.meta||"",price:e.price||"",thumb:e.thumb||"assets/img/box.svg",sub:Array.isArray(e.sub)?e.sub:[],orderId:e.orderId||e.id||null};try{let r=await h("/api/delivery-cart",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)});if(!r.ok){let i=await r.json().catch(()=>({}));return String(i.error||"").toLowerCase().includes("unauthorized")?(location.hash="#login",!1):(alert(i.error||"\u0425\u04AF\u0440\u0433\u044D\u043B\u0442 \u043D\u044D\u043C\u044D\u0445\u044D\u0434 \u0430\u043B\u0434\u0430\u0430 \u0433\u0430\u0440\u043B\u0430\u0430"),!1)}return!0}catch{return alert("\u0425\u04AF\u0440\u0433\u044D\u043B\u0442 \u043D\u044D\u043C\u044D\u0445\u044D\u0434 \u0430\u043B\u0434\u0430\u0430 \u0433\u0430\u0440\u043B\u0430\u0430"),!1}}buildActiveOrderData(e,t){let r=(e.title||"").split("-").map(d=>d.trim()),i=r[0]||"",s=r[1]||"",a=Array.isArray(e.sub)&&e.sub.length?e.sub[0]:null,n=t?.customer||e?.customer||{};return{orderId:e?.orderId||null,from:t?.from_name||i,to:t?.to_name||s,item:a?.name||"",items:Array.isArray(e.sub)?e.sub:[],total:e.price||"",createdAt:t?.created_at||new Date().toISOString(),customer:{name:n?.name||"\u0427\u0438\u0433\u0446\u0430\u043B\u043C\u0430\u0430",phone:n?.phone||"99001234",studentId:n?.studentId||n?.student_id||"23b1num0245",avatar:n?.avatar||"assets/img/profile.jpg"}}}async saveActiveOrder(e){try{await h("/api/active-order",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({order:e})})}catch{}}async loadCurrentUser(){if(this.currentUser)return this.currentUser;try{let e=await h("/api/auth/me");if(!e.ok)this.currentUser=null;else{let t=await e.json();this.currentUser=t?.user||null}}catch{this.currentUser=null}return this.currentUser}removeFromOffersList(e){if(!e||typeof e!="object")return!1;let t=localStorage.getItem("offers"),r=[];try{r=t?JSON.parse(t):[]}catch(d){console.error("Offers \u0437\u0430\u0434\u043B\u0430\u0445\u0430\u0434 \u0430\u043B\u0434\u0430\u0430:",d),r=[]}let i=e.orderId||e.id||null,s=`${e.title||""}|${e.meta||""}|${e.price||""}`,a=r.length,n=r.filter(d=>{let l=d.orderId||d.id||null;return i&&l&&String(l)===String(i)?!1:`${d.title||""}|${d.meta||""}|${d.price||""}`!==s});if(i){let d=this.getRemovedStorageKey("removed_offer_ids"),l=localStorage.getItem(d),c=[];try{c=JSON.parse(l)||[]}catch{c=[]}let u=String(i);c.includes(u)||(c.push(u),localStorage.setItem(d,JSON.stringify(c)))}return n.length===a?!1:(localStorage.setItem("offers",JSON.stringify(n)),window.dispatchEvent(new CustomEvent("offer-removed",{detail:{removedOffer:e,remainingOffers:n}})),!0)}getRemovedStorageKey(e){let t=localStorage.getItem("authUserKey"),r=this.currentUser?.id||"",i=t||r||"";return i?`${e}:${i}`:e}refreshOffersList(){window.dispatchEvent(new Event("offers-updated"))}parseMetaToISO(e){if(!e)return null;let t=e.replace("\u2022",""),r=Date.parse(t);return Number.isNaN(r)?null:new Date(r).toISOString()}normalizeName(e){let t=String(e||"").trim();if(!t)return"\u0427\u0438\u0433\u0446\u0430\u043B\u043C\u0430\u0430";let r=t.split(/\s+/).filter(i=>i&&i.length>1);return r.length?r.join(" "):t}};customElements.define("offer-modal",Q);var G=class extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"})}connectedCallback(){this.render(),this.elements(),this.events()}render(){this.shadowRoot.innerHTML=`
      <style>
        :host {
          font-family: inherit;
        }
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }
        #confirm-modal {
          position: fixed;
          inset: 0;
          display: none;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(4px);
          z-index: 10000;
          padding: 1rem;
        }
        #confirm-modal.show { display: flex; }
        #confirm-modal .modal-content {
          background: #fff;
          border-radius: 20px;
          width: min(480px, 100%);
          padding: 1.6rem 1.8rem;
          box-shadow: 0 24px 70px rgba(0,0,0,0.2);
          display: flex;
          flex-direction: column;
          gap: 0.9rem;
          text-align: center;
        }
        #confirm-modal h3 {
          margin: 0;
          font-size: 1.3rem;
          color: #111827;
        }
        #confirm-modal p {
          margin: 0;
          color: #374151;
          line-height: 1.45;
        }
        #confirm-modal .modal-actions {
          display: flex;
          justify-content: space-between;
          gap: 0.75rem;
          margin-top: 0.75rem;
        }
        #confirm-modal .btn {
          border: none;
          background: transparent;
          font: inherit;
          cursor: pointer;
        }
        #confirm-modal .btn--gray {
          background: #f9fafb;
          color: #111827;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 0.85rem 1.4rem;
          font-weight: 700;
        }
        #confirm-modal .btn--accent {
          background: var(--color-accent);
          color: #fff;
          border-radius: 12px;
          padding: 0.85rem 1.4rem;
          font-weight: 800;
        }
        #confirm-modal .detail-row {
          text-align: left;
          background: #f9fafb;
          border-radius: 12px;
          padding: 0.85rem 1rem;
          border: 1px solid #eef2f7;
          color: #1f2937;
          line-height: 1.5;
        }
        #confirm-modal .detail-row strong {
          display: inline-block;
          min-width: 4.7rem;
        }
        #confirm-modal .total-price {
          color: var(--color-accent);
        }
        @media (prefers-color-scheme: dark) {
          #confirm-modal .modal-content {
            background: #0f172a;
            color: #e5e7eb;
            border: 1px solid #243040;
            box-shadow: 0 24px 70px rgba(0,0,0,0.45);
          }
          #confirm-modal h3 {
            color: #f9fafb;
          }
          #confirm-modal p {
            color: #9aa4b2;
          }
          #confirm-modal .btn--gray {
            background: #111827;
            color: #e5e7eb;
            border-color: #243040;
          }
          #confirm-modal .detail-row {
            background: #111827;
            border-color: #243040;
            color: #e5e7eb;
          }
        }
      </style>

      <div id="confirm-modal" hidden>
        <div class="modal-content" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
          <h3 id="confirm-title">\u0417\u0430\u0445\u0438\u0430\u043B\u0433\u0430 \u0431\u0430\u0442\u0430\u043B\u0433\u0430\u0430\u0436\u0443\u0443\u043B\u0430\u0445 \u0443\u0443?</h3>
          <p id="confirm-text"></p>
          <div class="modal-actions">
            <button id="cancel-order" class="btn btn--gray">\u0426\u0443\u0446\u043B\u0430\u0445</button>
            <button id="confirm-order" class="btn btn--accent">\u0411\u0430\u0442\u0430\u043B\u0433\u0430\u0430\u0436\u0443\u0443\u043B\u0430\u0445</button>
          </div>
        </div>
      </div>
    `}elements(){this.modal=this.shadowRoot.querySelector("#confirm-modal"),this.confirmTextEl=this.shadowRoot.querySelector("#confirm-text"),this.cancelBtn=this.shadowRoot.querySelector("#cancel-order"),this.confirmBtn=this.shadowRoot.querySelector("#confirm-order")}events(){this.cancelBtn&&this.cancelBtn.addEventListener("click",()=>{this.close(),this.dispatchEvent(new Event("cancel"))}),this.confirmBtn&&this.confirmBtn.addEventListener("click",()=>{this.dispatchEvent(new Event("confirm"))}),this.modal&&this.modal.addEventListener("click",e=>{e.target===this.modal&&(this.close(),this.dispatchEvent(new Event("cancel")))})}open(e,t){if(!this.modal||!this.confirmTextEl)return;this._lastFocus=document.activeElement;let r=t?.items?.length?t.items.map(d=>`\u2022 ${d.name} \u2014 ${d.qty} \u0448\u0438\u0440\u0445\u044D\u0433`).join("<br>"):"\u0411\u0430\u0440\u0430\u0430 \u0441\u043E\u043D\u0433\u043E\u0433\u0434\u043E\u043E\u0433\u04AF\u0439",i=S(t.total??0),s=I(e.scheduledAt),[a,n]=s?s.split("\u2022"):["",""];this.confirmTextEl.innerHTML=`
      <div class="detail-row">
        <strong>\u0425\u0430\u0430\u043D\u0430\u0430\u0441:</strong> ${e.from}<br>
        <strong>\u0425\u0430\u0430\u0448\u0430\u0430:</strong> ${e.to}<br>
        <strong>\u04E8\u0434\u04E9\u0440:</strong> ${a||"-"}<br>
        <strong>\u0426\u0430\u0433:</strong> ${n||"-"}
      </div>
      <div class="detail-row">
        <strong>\u0422\u0430\u043D\u044B \u0445\u043E\u043E\u043B:</strong><br>
        ${r}
      </div>
      <div class="detail-row" style="text-align:center;">
        <strong>\u041D\u0438\u0439\u0442 \u04AF\u043D\u044D:</strong> 
        <span class="total-price">${i}</span>
      </div>
    `,this.modal.removeAttribute("hidden"),this.modal.classList.add("show"),this.confirmBtn&&this.confirmBtn.focus()}close(){this.modal&&(this._lastFocus&&this._lastFocus.focus(),this.modal.classList.remove("show"),this.modal.setAttribute("hidden",""))}};customElements.define("confirm-modal",G);var Y=class extends HTMLElement{constructor(){super(),this.pendingOrder=null,this.pendingOffer=null,this.confirmModal=null,this.handleConfirm=()=>this.batalgaajuulahZahialga(),this.handleCancel=()=>this.hideBatalgaajiltModal()}connectedCallback(){this.bindModal(),this.attach()}attach(){this.confirmModal&&(this.confirmModal.addEventListener("confirm",this.handleConfirm),this.confirmModal.addEventListener("cancel",this.handleCancel))}disconnectedCallback(){this.detach()}detach(){this.confirmModal&&(this.confirmModal.removeEventListener("confirm",this.handleConfirm),this.confirmModal.removeEventListener("cancel",this.handleCancel))}bindModal(){let e=this.closest("home-page")||document;this.confirmModal=e.querySelector("confirm-modal")}formatUne(e){return Number(e||0).toLocaleString("mn-MN")+"\u20AE"}formatTovch(e){let t=new Date(e);if(isNaN(t.getTime()))return"";let r=t.toLocaleDateString("en-US",{month:"2-digit",day:"2-digit",year:"2-digit"}),i=t.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});return`${r} \u2022 ${i}`}open(e,t){this.confirmModal||this.bindModal(),!(!this.confirmModal||typeof this.confirmModal.open!="function")&&(this.pendingOrder=e||null,this.pendingOffer=t||null,this.confirmModal.open(e,t))}hideBatalgaajiltModal(){this.confirmModal&&(this.confirmModal.close(),this.pendingOrder=null,this.pendingOffer=null)}async tentsvvlehHereglegchMedeelel(e){if(!e)return;let t=await h(`/api/customers/${e}`);if(!t.ok)return;let r=await t.json();r&&(r.name&&localStorage.setItem("userName",r.name),r.phone&&localStorage.setItem("userPhone",r.phone),localStorage.setItem("userId",r.id),r.student_id&&localStorage.setItem("userDisplayId",r.student_id),window.dispatchEvent(new Event("user-updated")))}async batalgaajuulahZahialga(){if(!this.pendingOrder||!this.pendingOffer){this.hideBatalgaajiltModal();return}let{userId:e,registered:t}=this.readNevtrelt();if(!t||!this.shalgahUuid(e)){localStorage.setItem("pendingOrderDraft",JSON.stringify(this.pendingOrder)),localStorage.setItem("pendingOfferDraft",JSON.stringify(this.pendingOffer)),this.hideBatalgaajiltModal(),location.hash="#login";return}if(!this.pendingOrder.fromId||!this.pendingOrder.toId){alert("\u0425\u0430\u0430\u043D\u0430\u0430\u0441/\u0425\u0430\u0430\u0448\u0430\u0430 \u0441\u043E\u043D\u0433\u043E\u043D\u043E \u0443\u0443");return}if(!Array.isArray(this.pendingOffer.items)||this.pendingOffer.items.length===0){alert("\u0421\u0430\u0433\u0441 \u0445\u043E\u043E\u0441\u043E\u043D \u0431\u0430\u0439\u043D\u0430");return}let r=this.pendingOffer.items.map(s=>{let a=Number(s.price),n=Number(s.qty);return{menuItemKey:s.id,name:s.name,unitPrice:Number.isFinite(a)?a:0,qty:Number.isFinite(n)&&n>0?n:1,options:{}}}).filter(s=>s.qty>0),i=this.buildIlgeehData(e,r);try{let s=await h("/api/orders",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(i)}),a=await s.json().catch(()=>({}));if(!s.ok){alert(a?.error||"\u0417\u0430\u0445\u0438\u0430\u043B\u0433\u0430 \u04AF\u04AF\u0441\u0433\u044D\u0445\u044D\u0434 \u0430\u043B\u0434\u0430\u0430 \u0433\u0430\u0440\u043B\u0430\u0430");return}a?.customerId&&(localStorage.setItem("userId",a.customerId),this.tentsvvlehHereglegchMedeelel(a.customerId)),this.writeIdevhteiZahialga(),this.saveSanal(a),this.hideBatalgaajiltModal(),this.guilgehSanalRuu()}catch{alert("\u0421\u0435\u0440\u0432\u0435\u0440\u0442\u044D\u0439 \u0445\u043E\u043B\u0431\u043E\u0433\u0434\u043E\u0436 \u0447\u0430\u0434\u0441\u0430\u043D\u0433\u04AF\u0439")}}readNevtrelt(){return{userId:localStorage.getItem("userId"),registered:localStorage.getItem("userRegistered")==="1"}}shalgahUuid(e){return/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(e||"")}buildIlgeehData(e,t){return{customerId:e||null,fromPlaceId:this.pendingOrder.fromId,toPlaceId:this.pendingOrder.toId,scheduledAt:this.pendingOrder.createdAt,deliveryFee:Number.isFinite(this.pendingOffer.deliveryFee)?this.pendingOffer.deliveryFee:0,items:t,customerName:`${localStorage.getItem("userLastName")||""} ${localStorage.getItem("userName")||"\u0417\u043E\u0447\u0438\u043D \u0445\u044D\u0440\u044D\u0433\u043B\u044D\u0433\u0447"}`.trim(),customerPhone:localStorage.getItem("userPhone")||"00000000",customerStudentId:localStorage.getItem("userDisplayId")||"",note:this.pendingOrder.fromDetail?`Pickup: ${this.pendingOrder.fromDetail}`:null}}writeIdevhteiZahialga(){localStorage.setItem("activeOrder",JSON.stringify(this.pendingOrder)),localStorage.setItem("orderStep","0"),window.dispatchEvent(new Event("order-updated"))}saveSanal(e){let t=JSON.parse(localStorage.getItem("offers")||"[]");t.unshift({...this.pendingOffer,orderId:e.orderId,meta:this.formatTovch(this.pendingOrder.createdAt),from:this.pendingOrder.from,fromDetail:this.pendingOrder.fromDetail,to:this.pendingOrder.to,title:`${this.pendingOrder.from} - ${this.pendingOrder.to}`,price:this.formatUne((e?.total??this.pendingOffer.total)||0),thumb:this.pendingOffer.thumb||"assets/img/box.svg",customer:{name:localStorage.getItem("userName")||"\u0422\u043E\u0434\u043E\u0440\u0445\u043E\u0439\u0433\u04AF\u0439",phone:localStorage.getItem("userPhone")||"\u0423\u0442\u0430\u0441\u0433\u04AF\u0439",studentId:localStorage.getItem("userDisplayId")||"ID \u0431\u0430\u0439\u0445\u0433\u04AF\u0439",avatar:localStorage.getItem("userAvatar")||"assets/img/profile.jpg"},sub:this.pendingOffer.items.map(i=>({name:`${i.name} x${i.qty}`,price:this.formatUne(i.price*i.qty)}))}),localStorage.setItem("offers",JSON.stringify(t));let r=document.querySelector("#offers");r&&"items"in r&&(r.items=t)}guilgehSanalRuu(){let e=document.querySelector("#offers");!e||!e.scrollIntoView||setTimeout(()=>{e.scrollIntoView({behavior:"smooth",block:"start"})},150)}};customElements.define("order-confirm",Y);var W=class extends HTMLElement{connectedCallback(){this.renderEmpty(),this.handleOrderSelect=e=>{let t=e.detail||null;if(!t){this.renderEmpty();return}this.updateProgress(t.status)},this.handleOrderStatusChange=e=>{let r=(e.detail||{}).status||null;r&&this.updateProgress(r)},document.addEventListener("order-select",this.handleOrderSelect),document.addEventListener("order-status-change",this.handleOrderStatusChange)}renderEmpty(){this.innerHTML=`
      <div class="order-progress">
        <div class="step" data-step="0">
          <div class="step-indicator">
            <svg viewBox="0 0 24 24">
              <path d="M12 2C8.962 2 6.5 4.462 6.5 7.5C6.5 11.438 12 18 12 18C12 18 17.5 11.438 17.5 7.5C17.5 4.462 15.038 2 12 2ZM12 9.5C10.895 9.5 10 8.605 10 7.5C10 6.395 10.895 5.5 12 5.5C13.105 5.5 14 6.395 14 7.5C14 8.605 13.105 9.5 12 9.5Z"/>
            </svg>
          </div>
          <div><div class="step-label">\u0417\u0430\u0445\u0438\u0430\u043B\u0433\u0430 \u0445\u04AF\u043B\u044D\u044D\u043D \u0430\u0432\u0441\u0430\u043D</div></div>
        </div>

        <div class="step" data-step="1">
          <div class="step-indicator">
            <svg viewBox="0 0 24 24">
              <path d="M12 2C8.962 2 6.5 4.462 6.5 7.5C6.5 11.438 12 18 12 18C12 18 17.5 11.438 17.5 7.5C17.5 4.462 15.038 2 12 2ZM12 9.5C10.895 9.5 10 8.605 10 7.5C10 6.395 10.895 5.5 12 5.5C13.105 5.5 14 6.395 14 7.5C14 8.605 13.105 9.5 12 9.5Z"/>
            </svg>
          </div>
          <div><div class="step-label">\u0425\u04AF\u0440\u0433\u044D\u043B\u0442\u044D\u043D\u0434 \u0433\u0430\u0440\u0441\u0430\u043D</div></div>
        </div>

        <div class="step" data-step="2">
          <div class="step-indicator">
            <svg viewBox="0 0 24 24">
              <path d="M12 2C8.962 2 6.5 4.462 6.5 7.5C6.5 11.438 12 18 12 18C12 18 17.5 11.438 17.5 7.5C17.5 4.462 15.038 2 12 2ZM12 9.5C10.895 9.5 10 8.605 10 7.5C10 6.395 10.895 5.5 12 5.5C13.105 5.5 14 6.395 14 7.5C14 8.605 13.105 9.5 12 9.5Z"/>
            </svg>
          </div>
          <div><div class="step-label">\u0410\u043C\u0436\u0438\u043B\u0442\u0442\u0430\u0439 \u0445\u04AF\u043B\u044D\u044D\u043D \u0430\u0432\u0441\u0430\u043D</div></div>
        </div>
      </div>
    `}mapStatusToStep(e){switch((e||"").toLowerCase()){case"delivering":return 1;case"delivered":return 2;default:return 0}}updateProgress(e){let t=this.mapStatusToStep(e);this.querySelectorAll(".step").forEach((i,s)=>{i.classList.remove("active","completed"),s<t?i.classList.add("completed"):s===t&&i.classList.add("active")})}disconnectedCallback(){this.handleOrderSelect&&document.removeEventListener("order-select",this.handleOrderSelect),this.handleOrderStatusChange&&document.removeEventListener("order-status-change",this.handleOrderStatusChange)}};customElements.define("order-progress",W);var X=class extends HTMLElement{connectedCallback(){let e=this.hasAttribute("data-active"),t=this.getAttribute("header")||"",r=this.getAttribute("detail")||"";this.innerHTML=`
      <article class="order-card">
        <div class="order-info">
          <h3>${t}</h3>
          <p>${r}</p>
        </div>
        <button class="view-btn"><svg xmlns="http://www.w3.org/2000/svg" width="800px" height="800px" viewBox="0 0 24 24">
  <title>i</title>
  <g id="Complete">
    <g id="expand">
      <g>
        <polyline id="Right-2" data-name="Right" points="3 17.3 3 21 6.7 21" fill="none" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
        <line x1="10" y1="14" x2="3.8" y2="20.2" fill="none" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
        <line x1="14" y1="10" x2="20.2" y2="3.8" fill="none" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
        <polyline id="Right-3" data-name="Right" points="21 6.7 21 3 17.3 3" fill="none" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
      </g>
    </g>
  </g>
</svg></button>
      </article>
    `,e&&this.loadActiveOrder()}async loadActiveOrder(){try{let e=await fetch("/api/active-order");if(!e.ok)return;let t=await e.json();console.log("active order data",t);let r=t?.order;if(!r)return;let i=r.from&&r.to?`${r.from} \u2192 ${r.to}`:"",s=r.item||"";console.log("detail",s);let a=this.querySelector(".order-info h3"),n=this.querySelector(".order-info p");a&&(a.textContent=i),n&&(n.textContent=s)}catch{}}};customElements.define("d-orders",X);var ee=class extends HTMLElement{connectedCallback(){this.renderEmpty(),this.handleDeliverySelect=e=>{let t=e.detail||null;if(!t){this.renderEmpty();return}this.render({from:t.from||"",to:t.to||"",createdAt:t.createdAt||""})},document.addEventListener("delivery-select",this.handleDeliverySelect)}renderEmpty(){this.innerHTML=""}render(e={}){let t=e.from||"",r=e.to||"",i=e.createdAt||"";if(!t&&!r&&!i){this.renderEmpty();return}this.innerHTML=`
      <div class="detail-header">
        <p><strong>${t}</strong> \u2192 <strong>${r}</strong></p>
        <p class="date">${i}</p>
        <person-detail title="\u0417\u0430\u0445\u0438\u0430\u043B\u0430\u0433\u0447\u0438\u0439\u043D \u043C\u044D\u0434\u044D\u044D\u043B\u044D\u043B" type="medium"></person-detail>
      </div>
    `}disconnectedCallback(){this.handleDeliverySelect&&document.removeEventListener("delivery-select",this.handleDeliverySelect)}};customElements.define("del-order-details",ee);var A=[{id:"o1",title:"GL Burger - 7-\u0440 \u0431\u0430\u0439\u0440 207",summary:"3 \u0448\u0438\u0440\u0445\u044D\u0433 \u2022 10,000\u20AE",from:"GL Burger",to:"\u041C\u0423\u0418\u0421 7-\u0440 \u0431\u0430\u0439\u0440",datetime:"2025.10.08 \u2022 09:36",total:"37,000\u20AE",items:["XL \u0431\u0430\u0433\u0446: 10,000\u20AE","M \u0431\u0430\u0433\u0446: 8,000\u20AE","L \u0431\u0430\u0433\u0446: 9,000\u20AE"],courier:{name:"\u0427\u0438\u0433\u0446\u0430\u043B\u043C\u0430\u0430",phone:"99001234",id:"23B1NUM0245",avatar:"assets/img/profile.jpg"},defaultStep:0},{id:"o2",title:"CU - 8-\u0440 \u0431\u0430\u0439\u0440 209",summary:"1 \u0448\u0438\u0440\u0445\u044D\u0433 \u2022 5,000\u20AE",from:"CU",to:"\u041C\u0423\u0418\u0421 8-\u0440 \u0431\u0430\u0439\u0440",datetime:"2025.10.08 \u2022 10:15",total:"5,000\u20AE",items:["\u041A\u043E\u043B\u0430 0.5\u043B: 2,500\u20AE","\u0427\u0438\u043F\u0441: 2,500\u20AE"],courier:{name:"\u0411\u0430\u0442-\u041E\u0440\u0433\u0438\u043B",phone:"88112233",id:"23B1NUM0312",avatar:"assets/img/profile.jpg"},defaultStep:1}],Ee="deliverySteps";function Ie(){try{return JSON.parse(localStorage.getItem(Ee))||{}}catch{return{}}}function te(o){localStorage.setItem(Ee,JSON.stringify(o))}function Oe(o){return A.find(e=>String(e.id)===String(o))||A[0]}var Le=["\u0417\u0430\u0445\u0438\u0430\u043B\u0433\u0430 \u0431\u044D\u043B\u0442\u0433\u044D\u0445","\u0425\u04AF\u0440\u0433\u044D\u043B\u0442\u044D\u043D\u0434 \u0433\u0430\u0440\u0441\u0430\u043D","\u0410\u043C\u0436\u0438\u043B\u0442\u0442\u0430\u0439 \u0445\u04AF\u0440\u0433\u044D\u0441\u044D\u043D"],re=class extends HTMLElement{connectedCallback(){this.stepsState=Ie(),this.currentId=A[0]?.id||null,this.activeOrder=null,this.handleDeliverySelect=e=>{let t=e.detail||null,r=t?.orderId||t?.id||null;r&&(this.userSelected=!0,this.activeOrder={id:r},this.currentId=r,this.render())},this.handleOrderSelect=e=>{this.currentId=e.detail.id,this.render()},this.handleOrderUpdated=this.loadActiveOrder.bind(this),this.render(),this.loadActiveOrder(),document.addEventListener("order-select",this.handleOrderSelect),document.addEventListener("delivery-select",this.handleDeliverySelect),window.addEventListener("order-updated",this.handleOrderUpdated)}disconnectedCallback(){document.removeEventListener("order-select",this.handleOrderSelect),document.removeEventListener("delivery-select",this.handleDeliverySelect),window.removeEventListener("order-updated",this.handleOrderUpdated),this._ratingTimer&&(clearInterval(this._ratingTimer),this._ratingTimer=null)}async loadActiveOrder(){try{let e=await fetch("/api/active-order",{credentials:"include"});if(!e.ok)return;let r=(await e.json())?.order||null;if(this.userSelected)return;this.activeOrder=r;let i=r?.orderId||r?.id||null;i&&(this.currentId=i),this.render()}catch{}}getCurrentStep(){let e=this.getCurrentOrder();if(!e)return 0;let t=this.stepsState[e.id];return t===0||t?t:e.defaultStep||0}getCurrentOrder(){if(this.activeOrder){let e=this.activeOrder.orderId||this.activeOrder.id||null;if(e)return{id:e,defaultStep:0}}return Oe(this.currentId)}isUuid(e){return/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(e||""))}render(){if(this.getAttribute("data-empty")==="1"){this.innerHTML="";return}let e=this.getCurrentStep(),t=this.getCurrentOrder();if(!t){this.innerHTML="<p>\u0417\u0430\u0445\u0438\u0430\u043B\u0433\u0430 \u043E\u043B\u0434\u0441\u043E\u043D\u0433\u04AF\u0439.</p>";return}this.innerHTML=`
      <div class="order-progress">
        ${Le.map((i,s)=>`
          <div class="step
            ${s<e?"completed":""}
            ${s===e?"active":""}"
            data-step="${s}">
            <div class="step-indicator">
              <svg viewBox="0 0 24 24">
                <path d="M12 2C8.962 2 6.5 4.462 6.5 7.5C6.5 11.438 12 18 12 18C12 18 17.5 11.438 17.5 7.5C17.5 4.462 15.038 2 12 2ZM12 9.5C10.895 9.5 10 8.605 10 7.5C10 6.395 10.895 5.5 12 5.5C13.105 5.5 14 6.395 14 7.5C14 8.605 13.105 9.5 12 9.5Z"/>
              </svg>
            </div>
            <div>
              <div class="step-label">${i}</div>
              <p class="step-desc">
                ${s===0?"\u0417\u0430\u0445\u0438\u0430\u043B\u0433\u044B\u0433 \u0431\u044D\u043B\u0442\u0433\u044D\u0436 \u0434\u0443\u0443\u0441\u0441\u0430\u043D\u044B \u0434\u0430\u0440\u0430\u0430 \u0434\u0430\u0440\u0430\u0430\u0433\u0438\u0439\u043D \u0430\u043B\u0445\u0430\u043C \u0440\u0443\u0443 \u0448\u0438\u043B\u0436\u0438\u043D\u044D.":s===1?"\u0425\u04AF\u0440\u0433\u044D\u043B\u0442\u044D\u043D\u0434 \u0433\u0430\u0440\u0441\u0430\u043D \u04AF\u0435\u0434 \u0434\u0430\u0440\u0430\u0430\u0433\u0438\u0439\u043D \u0430\u043B\u0445\u0430\u043C\u044B\u0433 \u0434\u0430\u0440\u043D\u0430.":"\u0425\u044D\u0440\u044D\u0433\u043B\u044D\u0433\u0447\u0438\u0434 \u0445\u04AF\u043B\u044D\u044D\u043B\u0433\u044D\u043D \u04E9\u0433\u0447 \u0434\u0443\u0443\u0441\u0441\u0430\u043D \u04AF\u0435\u0434 \u0442\u04E9\u0433\u0441\u04E9\u043D\u04E9."}
              </p>
            </div>
          </div>
        `).join("")}
      </div>
      <button class="next-btn" type="button">Next</button>
    `;let r=this.querySelector(".next-btn");r.addEventListener("click",()=>{let i=this.getCurrentStep(),s=Le.length-1;if(i>=s){r.disabled=!0,r.textContent="\u04AE\u043D\u044D\u043B\u0433\u044D\u044D \u0445\u04AF\u043B\u044D\u044D\u0436 \u0431\u0430\u0439\u043D\u0430",r.style.opacity="0.6",this.startRatingPoll(t.id),alert("\u0417\u0430\u0445\u0438\u0430\u043B\u0430\u0433\u0447 \u04AF\u043D\u044D\u043B\u0433\u044D\u044D \u04E9\u0433\u0441\u043D\u0438\u0439 \u0434\u0430\u0440\u0430\u0430 \u0430\u0432\u0442\u043E\u043C\u0430\u0442\u0430\u0430\u0440 \u0434\u0443\u0443\u0441\u043D\u0430.");return}let a=i+1;this.stepsState[t.id]=a,te(this.stepsState),localStorage.setItem("orderStep",String(a));let n=t.id;this.isUuid(n)&&this.updateOrderStatus(n,a),a===s&&(localStorage.setItem("deliveryAwaitRating","1"),this.startRatingPoll(t.id)),this.render()})}async updateOrderStatus(e,t){let i={1:"delivering",2:"delivered"}[t]||"created";try{let s=await fetch(`/api/orders/${encodeURIComponent(e)}/status`,{method:"PATCH",credentials:"include",headers:{"Content-Type":"application/json"},body:JSON.stringify({status:i})});if(!s.ok){let a=await s.json().catch(()=>({}));console.warn("status update failed",a?.error||s.status)}}catch(s){console.warn("status update error",s)}}startRatingPoll(e){this._ratingTimer||(this._ratingTimer=setInterval(async()=>{try{let t=await fetch("/api/auth/me",{credentials:"include"});if(!t.ok)return;let i=(await t.json())?.user?.id;if(!i)return;let s=await fetch(`/api/ratings/courier/${encodeURIComponent(i)}`,{credentials:"include"});if(!s.ok||!((await s.json())?.items||[]).some(l=>String(l.order_id)===String(e)))return;clearInterval(this._ratingTimer),this._ratingTimer=null,delete this.stepsState[e],te(this.stepsState),localStorage.removeItem("deliveryAwaitRating"),window.NumAppState?.resetToGuest("rating_done")}catch{}},3e3))}};customElements.define("del-order-progress",re);var ie=class extends HTMLElement{constructor(){super()}connectedCallback(){this.title=this.getAttribute("title")??"",this.type=this.getAttribute("type")??"medium",this.render(),this.handleUserUpdated=this.loadData.bind(this),window.addEventListener("user-updated",this.handleUserUpdated),this.loadData()}disconnectedCallback(){this.handleUserUpdated&&window.removeEventListener("user-updated",this.handleUserUpdated)}attributeChangedCallback(e,t,r){}adoptedCallback(){}render(){let e=this.orderCustomer||null,t=e?.name||"\u0427\u0438\u0433\u0446\u0430\u043B\u043C\u0430\u0430",r=this.normalizeName(t),i=e?.phone||"99001234",s=e?.studentId||"23b1num0245",a=e?.avatar||"assets/img/profile.jpg";this.innerHTML=`
        <p style="font-weight: bold; font-size: 1rem;">${this.title}</p>
        <div class="delivery ${this.type=="medium"?"":"big"}">
          <img src="${this.escape(a)}" alt="\u0417\u0430\u0445\u0438\u0430\u043B\u0430\u0433\u0447\u0438\u0439\u043D \u0437\u0443\u0440\u0430\u0433">
          <div class="delivery-info">
            <h3>\u041D\u044D\u0440: ${this.escape(r)}</h3>
            <p>\u0423\u0442\u0430\u0441: ${this.escape(i)}</p>
            <p>ID: ${this.escape(s)}</p>
          </div>
        </div>`;let n=this.querySelector("div.delivery");n&&n.addEventListener("click",()=>{let d=document.querySelector("numd-deliverycard");d&&typeof d.addDelivery=="function"&&d.addDelivery(this)})}escape(e){return String(e||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;")}normalizeName(e){let t=String(e||"").trim();if(!t)return"\u0427\u0438\u0433\u0446\u0430\u043B\u043C\u0430\u0430";let r=t.split(/\s+/).filter(i=>i&&i.length>1);return r.length?r.join(" "):t}async loadData(){try{let e=await fetch("/api/auth/me");if(e.ok){let t=await e.json();this.currentUser=t?.user||null}else this.currentUser=null}catch{this.currentUser=null}try{let e=await fetch("/api/active-order");if(e.ok){let t=await e.json();this.orderCustomer=t?.order?.customer||null}else this.orderCustomer=null}catch{this.orderCustomer=null}this.render()}};window.customElements.define("person-detail",ie);var se=class extends HTMLElement{connectedCallback(){this.setEmpty()}setData({name:e,phone:t,student_id:r,id:i}){console.log("Courier data:",{name:e,phone:t,student_id:r,id:i}),this.innerHTML=`
      <article class="courier-card">
        <div class="delivery">
          <img src="assets/img/profile.jpg" alt="\u0425\u04AF\u0440\u0433\u044D\u0433\u0447\u0438\u0439\u043D \u0437\u0443\u0440\u0430\u0433">
          <div class="courier-info">
            <h3>\u041D\u044D\u0440: ${v(e||"\u0425\u04AF\u0440\u0433\u044D\u0433\u0447")}</h3>
            <p>\u0423\u0442\u0430\u0441: ${v(t)}</p>
            <p>ID: ${v(r)}</p>
          </div>
        </div>
      </article>
    `}setEmpty(){this.innerHTML=`
      <article class="courier-card">
        <p class="muted">\u0425\u04AF\u0440\u0433\u044D\u0433\u0447 \u0445\u04AF\u043B\u044D\u044D\u0436 \u0430\u0432\u0430\u0430\u0433\u04AF\u0439 \u0431\u0430\u0439\u043D\u0430.</p>
      </article>
    `}};customElements.define("courier-card",se);var ae=class extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this.value=0}connectedCallback(){let e=parseInt(this.getAttribute("max"))||5,t=this.getAttribute("color")||"gold",r=this.getAttribute("size")||"26px",i=document.createElement("style");i.textContent=`
      .rating {
        display: flex;
        gap: 5px;
        cursor: pointer;
        justify-content: center;
      }
      .star {
        font-size: ${r};
        color: #ccc;
        transition: color 0.25s;
      }
      .star.filled {
        color: ${t};
      }
    `;let s=document.createElement("div");s.classList.add("rating");for(let a=1;a<=e;a++){let n=document.createElement("span");n.textContent="\u2605",n.classList.add("star"),n.addEventListener("mouseover",()=>this.updateStars(a)),n.addEventListener("mouseout",()=>this.updateStars(this.value)),n.addEventListener("click",()=>{this.value=a,this.setAttribute("value",a),this.dispatchEvent(new CustomEvent("rate",{detail:a}))}),s.appendChild(n)}this.shadowRoot.append(i,s)}updateStars(e){this.shadowRoot.querySelectorAll(".star").forEach((r,i)=>{r.classList.toggle("filled",i<e)})}getValue(){return this.value}reset(){this.value=0,this.updateStars(0)}};customElements.define("rating-stars",ae);var ne=class extends HTMLElement{constructor(){super(),this.selectedOrder=null}connectedCallback(){this.render(),this.bindEvents(),this.handleOrderSelect=e=>{let t=e.detail||null;if(console.log("Order selected:",e.detail),this.selectedOrder=t,t){let r=String(t.status||"").toLowerCase();this.updateButtonUI(r),r==="delivered"&&(localStorage.setItem("pendingRatingOrder",String(t.id)),this.open())}else this.updateButtonUI(null)},this.handleOrderStatusChange=e=>{let t=e.detail||{},r=String(t.status||"").toLowerCase();this.updateButtonUI(r),r==="delivered"&&this.selectedOrder?.id&&(localStorage.setItem("pendingRatingOrder",String(this.selectedOrder.id)),this.open())},document.addEventListener("order-select",this.handleOrderSelect),document.addEventListener("order-status-change",this.handleOrderStatusChange)}render(){this.innerHTML=`
      <button id="openRatingBtn" class="submit" style="display:none;">\u04AE\u043D\u044D\u043B\u0433\u044D\u044D \u04E9\u0433\u04E9\u0445</button>
      <div id="ratingModal" class="modal" style="display:none;">
        <div class="modal-content">
          <span class="close" role="button" aria-label="\u0425\u0430\u0430\u0445">&times;</span>
          <h3>\u0421\u044D\u0442\u0433\u044D\u0433\u0434\u044D\u043B \u04AF\u043B\u0434\u044D\u044D\u043D\u044D \u04AF\u04AF...</h3>
          <rating-stars max="5" color="orange" size="28px"></rating-stars>
          <input type="text" id="ratingComment" placeholder="\u0421\u044D\u0442\u0433\u044D\u0433\u0434\u044D\u043B \u04AF\u043B\u0434\u044D\u044D\u043D\u044D \u04AF\u04AF...">
          <button class="submit" id="submitRatingBtn">\u0418\u043B\u0433\u044D\u044D\u0445</button>
        </div>
      </div>
    `}bindEvents(){let e=this.querySelector("#ratingModal"),t=this.querySelector("#openRatingBtn"),r=this.querySelector(".close"),i=this.querySelector("#submitRatingBtn"),s=this.querySelector("rating-stars");this._onDocClick=a=>{e&&e.style.display==="block"&&a.target===e&&this.close()},document.addEventListener("click",this._onDocClick),t&&(t.onclick=()=>{if(!this.selectedOrder?.id){alert("\u0417\u0430\u0445\u0438\u0430\u043B\u0433\u0430 \u0441\u043E\u043D\u0433\u043E\u043D\u043E \u0443\u0443.");return}if(String(this.selectedOrder?.status||"").toLowerCase()!=="delivered"){alert("\u0425\u04AF\u0440\u0433\u044D\u043B\u0442 \u0434\u0443\u0443\u0441\u0441\u0430\u043D\u044B \u0434\u0430\u0440\u0430\u0430 \u04AF\u043D\u044D\u043B\u0433\u044D\u044D \u04E9\u0433\u043D\u04E9.");return}this.open()}),r&&(r.onclick=()=>this.close()),i&&(i.onclick=()=>this.submitRating()),s&&s.addEventListener("rate",a=>{console.log("\u04AE\u043D\u044D\u043B\u0433\u044D\u044D:",a.detail)})}updateButtonUI(e){let t=this.querySelector("#openRatingBtn");if(!t)return;let r=e==="delivered";t.style.display=r?"block":"none"}async submitRating(){let e=this.querySelector("rating-stars"),t=this.querySelector("#ratingComment"),r=Number(e?.getValue()||0),i=t?.value||"",s=this.selectedOrder?.id;if(!s){alert("\u0417\u0430\u0445\u0438\u0430\u043B\u0433\u0430 \u0441\u043E\u043D\u0433\u043E\u043D\u043E \u0443\u0443.");return}if(!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(s)){alert("\u042D\u043D\u044D \u0437\u0430\u0445\u0438\u0430\u043B\u0433\u0430\u0434 \u0441\u044D\u0442\u0433\u044D\u0433\u0434\u044D\u043B \u04AF\u043B\u0434\u044D\u044D\u0445 \u0431\u043E\u043B\u043E\u043C\u0436\u0433\u04AF\u0439.");return}if(!Number.isInteger(r)||r<1||r>5){alert("\u04AE\u043D\u044D\u043B\u0433\u044D\u044D \u0441\u043E\u043D\u0433\u043E\u043D\u043E \u0443\u0443.");return}try{let n=await h("/api/ratings",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({orderId:s,stars:r,comment:i})});if(!n.ok){let d=await n.json().catch(()=>({}));alert(d.error||"\u0421\u044D\u0442\u0433\u044D\u0433\u0434\u044D\u043B  \u0430\u043B\u0434\u0430\u0430 \u0433\u0430\u0440\u043B\u0430\u0430");return}this.markOrderRated(s),this.close(),this.reset(),localStorage.removeItem("pendingRatingOrder"),window.dispatchEvent(new Event("reviews-updated"));try{await h("/api/delivery-cart",{method:"DELETE"})}catch{}await window.NumAppState?.logout("rating_submitted"),window.dispatchEvent(new Event("delivery-cart-updated")),window.dispatchEvent(new Event("order-updated")),localStorage.getItem("authLoggedIn")==="1"&&window.NumAppState?.setState("customer","rating_submitted"),window.dispatchEvent(new Event("rating-completed"))}catch(n){console.error("submitRating error:",n),alert(n&&n.message?n.message:"\u0421\u044D\u0442\u0433\u044D\u0433\u0434\u044D\u043B \u0445\u0430\u0434\u0433\u0430\u043B\u0430\u0445\u0430\u0434 \u0430\u043B\u0434\u0430\u0430 \u0433\u0430\u0440\u043B\u0430\u0430")}}markOrderRated(e){let t="ratedOrders",r=[];try{r=JSON.parse(localStorage.getItem(t)||"[]")}catch{}let i=new Set(r.map(String));i.add(String(e)),localStorage.setItem(t,JSON.stringify([...i]))}open(){let e=this.querySelector("#ratingModal");e&&(e.style.display="block")}close(){let e=this.querySelector("#ratingModal");e&&(e.style.display="none")}reset(){let e=this.querySelector("rating-stars"),t=this.querySelector("#ratingComment");e&&e.reset(),t&&(t.value="")}disconnectedCallback(){this._onDocClick&&document.removeEventListener("click",this._onDocClick),this.handleOrderSelect&&document.removeEventListener("order-select",this.handleOrderSelect),this.handleOrderStatusChange&&document.removeEventListener("order-status-change",this.handleOrderStatusChange)}};customElements.define("rating-modal",ne);})();
