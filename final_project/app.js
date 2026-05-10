document.addEventListener("DOMContentLoaded", () => {
  // 1. 專案資料設定
  const originalProjects = [
    { title: "EMMA SANDERS", src: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop" },
    { title: "WANDER", src: "https://images.unsplash.com/photo-1481026469463-66327c86e544?q=80&w=800&auto=format&fit=crop" },
    { title: "EVER-EXPANDING", src: "https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?q=80&w=800&auto=format&fit=crop" },
    { title: "AFTERPARTY", src: "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?q=80&w=800&auto=format&fit=crop" },
    { title: "CORE", src: "https://images.unsplash.com/photo-1428366890462-dd4baecf492b?q=80&w=800&auto=format&fit=crop" },
    { title: "TAUBE", src: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?q=80&w=800&auto=format&fit=crop" },
    { title: "RESIDENT", src: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800&auto=format&fit=crop" },
    { title: "ADVISOR", src: "https://images.unsplash.com/photo-1506146332389-18140dc7b2fb?q=80&w=800&auto=format&fit=crop" },
    { title: "MINIMAXXX", src: "https://images.unsplash.com/photo-1515263487990-61b07816b324?q=80&w=800&auto=format&fit=crop" },
    { title: "AT THE DOOR", src: "https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=800&auto=format&fit=crop" }
  ];

  // 增加卡片數量以確保延伸效果
  const projects = [...originalProjects, ...originalProjects, ...originalProjects, ...originalProjects];

  const track = document.getElementById('track');
  const cursorTitle = document.getElementById('cursor-title');
  const cards = [];
  
  const cardCount = projects.length;
  const cardSpacing = 35; // 稍微調寬間距，增加呼吸感
  const loopWidth = cardCount * cardSpacing; 

  let loadedCount = 0; 
  let isLoaded = false; 

  const loaderPercent = document.getElementById('loader-percent');
  const viewport = document.getElementById('viewport');
  if (viewport) {
    viewport.style.opacity = '0';
    viewport.style.transition = 'opacity 1.5s ease';
  }

  let currentPercent = 0;
  let targetPercent = 0;

  function updateLoader() {
    if (isLoaded) return;
    currentPercent += (targetPercent - currentPercent) * 0.1;
    if (targetPercent - currentPercent < 0.5) currentPercent = targetPercent;
    if (loaderPercent) loaderPercent.innerText = Math.floor(currentPercent) + '%';

    if (currentPercent >= 99.5 && loadedCount >= cardCount) {
      if (loaderPercent) loaderPercent.innerText = '100%';
      hideLoader();
    } else {
      requestAnimationFrame(updateLoader);
    }
  }
  requestAnimationFrame(updateLoader);

  const hideLoader = () => {
    if (isLoaded) return;
    isLoaded = true;
    const loader = document.getElementById('loader');
    if (loader) {
      loader.style.opacity = '0';
      setTimeout(() => { loader.style.display = 'none'; }, 1000);
    }
    if (viewport) viewport.style.opacity = '1';

    // 開場動畫流程
    setTimeout(() => {
      targetAutoScrollSpeed = 0; 
      setTimeout(() => {
        targetGlobalZoom = -150; // 調整最終視角深度
      }, 800);
    }, 1000);
  };

  setTimeout(() => {
    if (!isLoaded) { targetPercent = 100; loadedCount = cardCount; }
  }, 8000);

  let mouseX = 0;
  let mouseY = 0;
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  projects.forEach((project, i) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'card-wrapper';
    const inner = document.createElement('div');
    inner.className = 'card-inner';
    const img = document.createElement('img');
    const handleLoad = () => {
      loadedCount++;
      targetPercent = (loadedCount / cardCount) * 100;
    };
    img.onload = handleLoad;
    img.onerror = handleLoad; 
    img.src = project.src;
    inner.appendChild(img);
    wrapper.appendChild(inner);
    track.appendChild(wrapper);
    const cardObj = { el: wrapper, inner: inner, index: i, isHovered: false };
    
    wrapper.addEventListener('mouseenter', () => {
      cardObj.isHovered = true;
      cursorTitle.innerText = project.title;
      cursorTitle.style.opacity = '1';
    });
    wrapper.addEventListener('mouseleave', () => {
      cardObj.isHovered = false;
      cursorTitle.style.opacity = '0';
    });
    wrapper.addEventListener('click', () => { window.open(project.src, '_blank'); });
    cards.push(cardObj);
  });

  let currentScroll = 0;
  let targetScroll = 0;
  let globalZoom = -100; 
  let targetGlobalZoom = -350;
  let autoScrollSpeed = 15; 
  let targetAutoScrollSpeed = 6;

  window.addEventListener('wheel', (e) => {
    targetScroll += e.deltaY * 0.8;
  });

  function render() {
    if (isLoaded) {
      autoScrollSpeed += (targetAutoScrollSpeed - autoScrollSpeed) * 0.05;
      targetScroll += autoScrollSpeed;
      globalZoom += (targetGlobalZoom - globalZoom) * 0.03;
    }
    currentScroll += (targetScroll - currentScroll) * 0.08;

    if (cursorTitle.style.opacity === '1') {
      cursorTitle.style.transform = `translate3d(${mouseX + 20}px, ${mouseY + 20}px, 0)`;
    }

    cards.forEach(card => {
      let p = ((card.index * cardSpacing + currentScroll) % loopWidth + loopWidth) % loopWidth;
      let offset = p - loopWidth / 2;
      let isMobile = window.innerWidth < 800;
      
      let tx, ty, tz, rotateX, rotateY, rotateZ;

      if (isMobile) {
        tx = offset * 2.5;      
        ty = offset * - 2;       
        tz = -offset * 0.8 + globalZoom;
        rotateY = -40;            
        rotateX = -25;            
        rotateZ = -3;
      } else {
        tx = offset * 4.2;      
        ty = offset * -1.8;       
        tz = -offset * 1.2 + globalZoom;
        rotateY = -25;            
        rotateX = -45;            
        rotateZ = -6;
      }
      
      let scale = 1;          

      card.el.style.transform = `translate3d(${tx}px, ${ty}px, ${tz}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg) scale(${scale})`;
      
      // ==========================================
      // 🎯 修正關鍵：設定 z-index 確保前方的卡片在最上層
      // tz 為負值，加上足夠大的正偏移量，確保所有卡片 z-index > 0
      // 越靠近視角的卡片（tz 越大）z-index 越高，點擊事件才能正確命中
      // ==========================================
      card.el.style.zIndex = Math.round(tz + 10000);

      let depthRatio = Math.max(0, offset / (loopWidth / 2));
      let blur = depthRatio * 2.5; 
      let brightness = 1 - depthRatio * 0.35; 
      
      if (!card.isHovered) {
        card.inner.style.filter = `blur(${blur}px) brightness(${brightness})`;
      } else {
        card.inner.style.filter = `blur(0px) brightness(1.1)`;
      }
      
      // 🎯 刪除了多餘的 card.el.style.opacity = 1，防止破壞 preserve-3d
    });
    requestAnimationFrame(render);
  }
  render();
});