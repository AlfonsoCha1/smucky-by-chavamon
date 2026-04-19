/* ES: Comentarios base para mantenimiento. EN: Baseline comments for maintenance. */
(function () {
	if (document.getElementById("smuckyGlobalMenu")) return;

	const normalizedPath = (window.location.pathname || "").replace(/\\/g, "/").toLowerCase();
	const inSubfolder = /\/(ayuda|cuenta|informacion|paginas|soporte)\//.test(normalizedPath);
	const base = inSubfolder ? "../" : "";

	const css = `
	.smucky-menu-toggle {
		position: fixed;
		top: 14px;
		left: auto;
		right: 14px;
		width: 46px;
		height: 46px;
		border-radius: 12px;
		border: 1px solid rgba(255, 255, 255, .35);
		background: linear-gradient(135deg, #0f766e 0%, #115e59 58%, #0b3d3a 100%);
		box-shadow: 0 10px 24px rgba(15, 23, 42, .24);
		z-index: 9998;
		cursor: pointer;
		display: grid;
		align-content: center;
		justify-items: center;
		gap: 5px;
	}
	.smucky-menu-toggle span {
		width: 20px;
		height: 2px;
		border-radius: 10px;
		background: #fff;
	}

	.smucky-menu-overlay {
		position: fixed;
		inset: 0;
		background: rgba(2, 6, 23, .36);
		backdrop-filter: blur(2px);
		z-index: 9996;
	}

	.smucky-menu-drawer {
		position: fixed;
		top: 0;
		left: 0;
		width: min(320px, 86vw);
		height: 100vh;
		background:
			radial-gradient(circle at 90% 8%, rgba(239, 68, 68, .2) 0, transparent 32%),
			linear-gradient(160deg, #0f172a 0%, #111827 55%, #1f2937 100%);
		color: #e5e7eb;
		transform: translateX(-104%);
		transition: transform .25s ease;
		z-index: 9997;
		display: grid;
		grid-template-rows: auto 1fr auto;
		padding: 14px;
		gap: 12px;
		border-right: 1px solid rgba(148, 163, 184, .2);
	}
	.smucky-menu-drawer.open { transform: translateX(0); }

	.smucky-menu-head {
		display: flex;
		align-items: center;
		justify-content: flex-start;
		min-height: 56px;
		padding-left: 56px;
	}
	.smucky-menu-brand {
		display: inline-flex;
		align-items: center;
		gap: 10px;
	}
	.smucky-menu-brand img {
		width: 38px;
		height: 38px;
		border-radius: 8px;
		object-fit: contain;
		background: rgba(255,255,255,.08);
	}
	.smucky-menu-brand strong {
		font-size: .92rem;
		letter-spacing: .015em;
		line-height: 1.2;
	}

	.smucky-menu-links {
		display: grid;
		gap: 8px;
		align-content: start;
		overflow-y: auto;
		padding-right: 4px;
	}
	.smucky-menu-links a {
		color: #f8fafc;
		text-decoration: none;
		padding: 10px 12px;
		border-radius: 10px;
		border: 1px solid rgba(148, 163, 184, .25);
		background: rgba(255, 255, 255, .02);
		font-weight: 700;
	}
	.smucky-menu-links a:hover {
		background: rgba(20, 184, 166, .2);
		border-color: rgba(45, 212, 191, .35);
	}
	.smucky-menu-links a.guest-link {
		background: rgba(20, 184, 166, .16);
		border-color: rgba(94, 234, 212, .42);
	}
	.smucky-menu-links a.guest-link:hover {
		background: rgba(13, 148, 136, .28);
	}
	.smucky-menu-links button {
		font: inherit;
		text-align: left;
		color: #fee2e2;
		padding: 10px 12px;
		border-radius: 10px;
		border: 1px solid rgba(248, 113, 113, .45);
		background: rgba(127, 29, 29, .28);
		font-weight: 800;
		cursor: pointer;
	}
	.smucky-menu-links button:hover {
		background: rgba(185, 28, 28, .35);
		border-color: rgba(252, 165, 165, .7);
	}
	.smucky-menu-foot {
		font-size: .79rem;
		color: #94a3b8;
		border-top: 1px solid rgba(148, 163, 184, .24);
		padding-top: 10px;
	}

	@media (max-width: 700px) {
		.smucky-menu-toggle {
			top: 72px;
			left: auto;
			right: 12px;
			bottom: auto;
			width: 46px;
			height: 46px;
		}
	}
	`;

	const style = document.createElement("style");
	style.textContent = css;
	document.head.appendChild(style);

	const toggle = document.createElement("button");
	toggle.className = "smucky-menu-toggle";
	toggle.id = "smuckyGlobalMenu";
	toggle.type = "button";
	toggle.setAttribute("aria-label", "Abrir menu global");
	toggle.innerHTML = "<span></span><span></span><span></span>";

	const overlay = document.createElement("div");
	overlay.className = "smucky-menu-overlay";
	overlay.hidden = true;

	const drawer = document.createElement("aside");
	drawer.className = "smucky-menu-drawer";
	drawer.setAttribute("aria-hidden", "true");
	drawer.innerHTML = `
		<div class="smucky-menu-head">
			<div class="smucky-menu-brand">
				<img src="${base}LOGO DE LA EMPRESA/La-pura-letra-logo.png" alt="Logo Smucky">
				<strong>SMUCKY´s By CHAVAMON</strong>
			</div>
		</div>
		<nav class="smucky-menu-links">
			<a href="${base}index.html">Inicio</a>
			<a href="${base}cuenta/login.html" id="smuckyMenuLoginLink" class="guest-link">Iniciar sesiÃ³n</a>
			<a href="${base}cuenta/registro.html" id="smuckyMenuRegisterLink" class="guest-link">Registrarse</a>
			<a href="${base}cuenta/perfil.html" id="smuckyMenuProfileLink">Mi perfil</a>
			<a href="${base}cuenta/pedidos.html" id="smuckyMenuOrdersLink">Mis pedidos</a>
			<a href="${base}paginas/checkout.html" id="smuckyMenuCheckoutLink">Checkout</a>
			<a href="${base}ayuda/centro-ayuda.html">Centro de ayuda</a>
			<a href="${base}soporte/index.html">Soporte</a>
			<a href="${base}informacion/sobre-mi.html">Sobre nosotros</a>
			<button type="button" id="smuckyMenuLogoutBtn">Cerrar sesiÃ³n</button>
		</nav>
		<div class="smucky-menu-foot">Ropa deportiva y casual con estilo propio.</div>
	`;

	const firebaseConfig = {
		apiKey: "AIzaSyCewAiOXXWT7O1L2WCBksejOnf8sZFj2KQ",
		authDomain: "smuckys-by-chavamon-loginregis.firebaseapp.com",
		projectId: "smuckys-by-chavamon-loginregis",
		storageBucket: "smuckys-by-chavamon-loginregis.firebasestorage.app",
		messagingSenderId: "185108836763",
		appId: "1:185108836763:web:d7b923507c3c32e28e313e"
	};

	function clearSmuckyLocalData() {
		window.SmuckyAuth?.clearUser?.();

		Object.keys(sessionStorage)
			.filter((key) => key.startsWith("smucky_"))
			.forEach((key) => sessionStorage.removeItem(key));
	}

	async function signOutFirebase() {
		if (typeof window.firebase?.auth === "function") {
			try {
				await window.firebase.auth().signOut();
				return;
			} catch (error) {
				console.warn("No se pudo cerrar sesiÃ³n con Firebase compat:", error);
			}
		}

		try {
			const [{ initializeApp, getApps }, { getAuth, signOut }] = await Promise.all([
				import("https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js"),
				import("https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js")
			]);

			const app = getApps().find((item) => item.name === "auth-app")
				|| initializeApp(firebaseConfig, "auth-app");
			const auth = getAuth(app);
			await signOut(auth);
		} catch (error) {
			console.warn("No se pudo cerrar sesiÃ³n con Firebase modular:", error);
		}
	}

	function openMenu() {
		overlay.hidden = false;
		drawer.classList.add("open");
		drawer.setAttribute("aria-hidden", "false");
		toggle.setAttribute("aria-label", "Cerrar menu global");
		document.body.style.overflow = "hidden";
	}

	function closeMenu() {
		overlay.hidden = true;
		drawer.classList.remove("open");
		drawer.setAttribute("aria-hidden", "true");
		toggle.setAttribute("aria-label", "Abrir menu global");
		document.body.style.overflow = "";
	}

	toggle.addEventListener("click", () => {
		if (drawer.classList.contains("open")) closeMenu();
		else openMenu();
	});
	overlay.addEventListener("click", closeMenu);
	document.addEventListener("keydown", (event) => {
		if (event.key === "Escape") closeMenu();
	});

	const loginLink = drawer.querySelector("#smuckyMenuLoginLink");
	const registerLink = drawer.querySelector("#smuckyMenuRegisterLink");
	const profileLink = drawer.querySelector("#smuckyMenuProfileLink");
	const ordersLink = drawer.querySelector("#smuckyMenuOrdersLink");
	const checkoutLink = drawer.querySelector("#smuckyMenuCheckoutLink");

	const logoutBtn = drawer.querySelector("#smuckyMenuLogoutBtn");
	logoutBtn?.addEventListener("click", async () => {
		await signOutFirebase();
		clearSmuckyLocalData();
		syncMenuByAuth();
		closeMenu();
		alert("Sesión cerrada correctamente.");
		window.location.href = `${base}index.html`;
	});

	function toggleItem(element, show) {
		if (!element) return;
		element.style.display = show ? "block" : "none";
	}

	function syncMenuByAuth() {
		const user = window.SmuckyAuth?.getCurrentUser?.();
		const isLogged = Boolean(user && user.email);

		toggleItem(loginLink, !isLogged);
		toggleItem(registerLink, !isLogged);
		toggleItem(profileLink, isLogged);
		toggleItem(ordersLink, isLogged);
		toggleItem(checkoutLink, isLogged);
		toggleItem(logoutBtn, isLogged);
	}

	if (window.SmuckyAuth?.ready && typeof window.SmuckyAuth.ready.then === "function") {
		window.SmuckyAuth.ready.finally(syncMenuByAuth);
	} else {
		syncMenuByAuth();
	}

	function alignToggleForMobile() {
		if (!toggle) return;

		const isMobile = window.matchMedia("(max-width: 700px)").matches;
		if (!isMobile) {
			toggle.style.top = "14px";
			return;
		}

		const profileBtn = document.getElementById("profileBtn");
		if (!profileBtn) {
			toggle.style.top = "72px";
			return;
		}

		const rect = profileBtn.getBoundingClientRect();
		if (!rect.height) {
			toggle.style.top = "72px";
			return;
		}

		const toggleHeight = 46;
		const targetTop = Math.max(62, Math.round(rect.top + (rect.height - toggleHeight) / 2));
		toggle.style.top = `${targetTop}px`;
	}

	document.body.appendChild(toggle);
	document.body.appendChild(overlay);
	document.body.appendChild(drawer);

	alignToggleForMobile();
	window.addEventListener("resize", alignToggleForMobile);
	window.addEventListener("orientationchange", alignToggleForMobile);
})();

