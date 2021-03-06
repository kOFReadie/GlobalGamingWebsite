window.addEventListener("load", () =>
{
    slideShow();
    let twitchQueryParams = new URLSearchParams();
    twitchChannels.forEach(item => { twitchQueryParams.append("user_login", item); });
    makeTwitchRequest("anyLive", twitchQueryParams.toString(), (response) =>
    { if (JSON.parse(response).results) { document.querySelector("#twitchStreaming").classList.add("live"); } });
});

//#region Slideshow
function slideShow()
{
    document.querySelectorAll(".slideshowContainer").forEach((slideShow, index) =>
    {
        var slideInfoContainer = slideShow.getElementsByClassName("slideInfoContainer")[0].querySelectorAll("div");
        var slideButtons = slideInfoContainer[1];

        var slidesInfo = slideShow.getElementsByTagName("div")[0];
        var slides = slidesInfo.querySelectorAll("div");
        slides.forEach((slide, slideIndex) =>
        {
            var containImage = slide.getElementsByTagName("img")[0].getAttribute("src");
            var slideTitle = slide.getElementsByTagName("h3")[0].innerHTML;
            const regexReplace = /"/gi;
            var slideContent = slide.getElementsByTagName("p")[0].innerHTML.replace(regexReplace, "'");
            
            //var slideButton = slide.getElementsByTagName("button").length == 0 ? null : slide.getElementsByTagName("button")[0].getAttribute("onclick"); //Work in progress

            var button = document.createElement("button");
            button.innerHTML = "<p>5</p>";
            button.className = "slideButton";
            button.style = `width: ${(100/slides.length + 1) - 1}%; background-image: url(${containImage});`;
            button.setAttribute("onclick", `changeSlide(${index}, ${slideIndex}, "${containImage}", "${slideTitle}", "${slideContent}")`);
            button.setAttribute("index", `${slideIndex}`);
            slideButtons.appendChild(button);
        });

        slidesInfo.parentNode.removeChild(slidesInfo);
        slideButtons.children[0].click();
        slideShowTimer(index);
    });
}

function changeSlide(slideShowIndex, slideIndex, containImage, slideTitle, slideContent)
{
    var slideShow = document.getElementsByClassName("slideshowContainer")[slideShowIndex];
    var slideInfoContainer = slideShow.getElementsByClassName("slideInfoContainer")[0].querySelectorAll("div");
    var slideText = slideInfoContainer[0].children;
    var slideButtons = slideInfoContainer[1].querySelectorAll("button");

    //Set slide contents
    slideShow.getElementsByTagName("img")[0].src = slideShow.getElementsByTagName("img")[1].src;
    slideShow.getElementsByTagName("img")[1].src = containImage;
    slideShow.replaceChild(slideShow.getElementsByTagName("img")[1].cloneNode(), slideShow.getElementsByTagName("img")[1]);
    slideText[0].innerHTML = slideTitle;
    slideText[1].innerHTML = slideContent;

    //Set all buttons to default aside from the selected slideIndex
    slideButtons.forEach(element =>
    {
        element.style.border = "none";
        element.getElementsByTagName("p")[0].style.display = "none";
        element.style.paddingTop = "0px";
    });
    slideButtons[slideIndex].getElementsByTagName("p")[0].style.display = "block";
    slideButtons[slideIndex].style.paddingTop = "20px";
    //slideButtons[slideIndex].style.border = "2px solid white"; //Fix CSS before doing this
}

async function slideShowTimer(slideShowIndex)
{
    var slideShow = document.getElementsByClassName("slideshowContainer")[slideShowIndex];
    var buttons = slideShow.getElementsByClassName("slideInfoContainer")[0].querySelectorAll("div")[1].querySelectorAll("button");

    const desiredDisplayTime = 5; //Only change this to the desired display time in seconds

    var currentSlide = 0;
    var time = desiredDisplayTime;

    function slideChange()
    {
        if (time <= 0)
        {
            var nextSlide = currentSlide + 1;
            if (nextSlide > buttons.length - 1) { nextSlide = 0; }
            buttons[nextSlide].click();
            currentSlide = nextSlide;
            time = desiredDisplayTime + 1; //Set value to the desired display time + 1
        }

        time -= 1;
        buttons[currentSlide].children[0].innerHTML = time;
    }

    var slideTimer = setInterval(slideChange, 1000);

    buttons.forEach(element => //Listen for button click
    {
        element.addEventListener("click", () =>
        {
            currentSlide = parseInt(element.getAttribute("index"));
            clearInterval(slideTimer);
            element.children[0].innerHTML = time = desiredDisplayTime;
            slideTimer = setInterval(slideChange, 1000);
        });
    });

    slideShow.addEventListener("mouseover", () => { clearInterval(slideTimer); });

    slideShow.addEventListener("mouseleave", () => { slideTimer = setInterval(slideChange, 1000); });
}
//#endregion