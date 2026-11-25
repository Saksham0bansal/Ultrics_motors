const PRODUCTS = [
  {
    title: "9 Metre Electric Bus",
    tag: "Ultric 9M | Multipurpose, 32 seats",
    pdf: "assets/Ultric-9M-Specs.pdf",
    price: "Starting price INR 76,45,633 ex-showroom. Indicative; final price depends on configuration, duties and taxes.",
    sections: {
      "Dimensions & Weight": [["Length x Width x Height","9,200 x 2,500 x 3,200 mm"],["Seating","32 passengers + driver"],["Gross vehicle weight","12,500 kg"],["Max speed","80 km/h"]],
      "Motor": [["Motor","213 kW PMSM, 2,352 Nm"],["Battery","200 kWh LFP, 660 V"],["Range","180 km per charge"],["Charging","CCS2: 200 kW in 1.5 hrs, 80 kW in 2.5 hrs"]],
      "Brakes & Suspension": [["Brakes","Ventilated discs on all 4 wheels"],["Braking system","Electronic Braking System (EBS)"],["Driver assistance","ADAS: collision warning, lane monitoring, obstacle detection"],["Cameras","360° camera system"]],
      "Features": [["Seats","32 premium high-back, push-back and HHR, 2x2"],["Climate","40 kW AC with bacterial filtration"],["Comfort","USB-A and USB-C at every seat, LED ambient lighting, panoramic tinted windows"],["Battery safety","LFP chemistry, liquid-cooled, 3,000+ cycles"]],
      "Applications": [["Schools","Safe student transport, silent and zero exhaust"],["Universities","Campus shuttles, staff and student routes"],["Corporates","Employee transport with a lower ESG footprint"],["Hospitals","Patient transport and staff shuttles"]]
    }
  },
  {
    title: "12 Metre Intercity Seater",
    tag: "Ultric Carino 12M | 46 / 51 / 63 / 67 seats",
    pdf: "assets/Ultric-Carino-12M-Specs.pdf",
    price: "Contact us for a fleet quote.",
    sections: {
      "Dimensions & Weight": [["Length x Width x Height","12,000 x 2,590 x 3,570 mm"],["Wheelbase","6,200 mm"],["Gross vehicle weight","19,500 kg"],["Entry floor height","1,280 mm"],["Max gradeability","18%"]],
      "Motor": [["Motor","PMS drive motor, 235 kW, 3,256 Nm"],["Battery","299 kWh LFP, active liquid thermal control"],["Range","390 km+ per charge, plus up to 100 km/day from solar"],["Charging","CCS2 dual-gun DC in about 1 hr, AC depot in about 3 hrs"]],
      "Brakes & Suspension": [["Suspension","Pneumatic air suspension x4"],["Structure","600,000 km frame structure warranty"],["Operating range","-20°C to 55°C battery conditioning"]],
      "Features": [["Solar roof","Monocrystalline panels fitted as standard"],["Seats","Push-back HHR, 3x2 and 2x2 layouts"],["Cabin","USB ports at every seat, ambient lighting, overhead racks"],["Branding","White-label body paint and welcome screens"]],
      "Applications": [["Intercity","Long-distance and hill routes"],["Staff","Corporate staff transport"],["School","Education and institutional transit"]]
    }
  }
];

const grid = document.getElementById("prodGrid");
PRODUCTS.forEach((p, pi) => {
  const el = document.createElement("div");
  el.className = "prod";
  let html = `<h3>${p.title}</h3><p class="tag">${p.tag}</p>`;
  Object.entries(p.sections).forEach(([name, rows], si) => {
    const id = `acc-${pi}-${si}`;
    html += `<div class="acc"><button aria-expanded="false" aria-controls="${id}">${name}<i class="ico"></i></button>
      <div class="body" id="${id}"><div><ul>${rows.map(r => `<li><span>${r[0]}</span><span>${r[1]}</span></li>`).join("")}</ul></div></div></div>`;
  });
  html += `<a class="dl" href="${p.pdf}" download>Download technical specifications</a><p class="price">${p.price}</p>`;
  el.innerHTML = html;
  grid.appendChild(el);
});

grid.addEventListener("click", e => {
  const btn = e.target.closest(".acc button");
  if (!btn) return;
  const acc = btn.parentElement;
  const open = acc.classList.toggle("open");
  btn.setAttribute("aria-expanded", open);
});

const burger = document.getElementById("burger"), menu = document.getElementById("menu");
burger.addEventListener("click", () => {
  const o = menu.classList.toggle("open");
  burger.setAttribute("aria-expanded", o);
});
menu.addEventListener("click", e => { if (e.target.tagName === "A") { menu.classList.remove("open"); burger.setAttribute("aria-expanded", false); } });

const links = [...menu.querySelectorAll("a")];
const io = new IntersectionObserver(es => es.forEach(en => {
  if (en.isIntersecting) links.forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + en.target.id && !a.classList.contains("nav-cta")));
}), { rootMargin: "-45% 0px -50% 0px" });
document.querySelectorAll("main, section[id]").forEach(s => io.observe(s));


const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxN8El1t7qPvjRdunyiiAnOwEM49apguNXU8hwOIYmvHQFt1A1DtYFsnRL6AIuAyrlC/exec";

document.getElementById("form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const f = e.target;
  const st = document.getElementById("status");

  const name = f.elements.namedItem("name").value.trim();
  const email = f.elements.namedItem("email").value.trim();

  const phone = f.elements.namedItem("phone").value.trim();
  const bus = f.elements.namedItem("bus").value;
  const msg = f.elements.namedItem("msg").value.trim();

  f.elements.namedItem("name").classList.toggle("err", !name);

  const bad = !/^\S+@\S+\.\S+$/.test(email);
  f.elements.namedItem("email").classList.toggle("err", bad);

  if (!name || bad) {
    st.textContent = "Please enter your name and a valid email.";
    return;
  }

  const data = { name, email, phone, bus, msg };

  const submitButton = f.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  st.textContent = "Submitting your enquiry...";

  try {
    await fetch(SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify(data)
    });

    st.textContent =
      "Thank you! Your enquiry has been submitted.";

    f.reset();

  } catch (error) {
    st.textContent =
      "Unable to submit. Please try again.";

  } finally {
    submitButton.disabled = false;
  }
});

