import source from '../../source';
import random from '../../utils/random';
import $ from '../../utils/element';

/**
 * Replaces current script with the html template.
 *
 * Returns container element as $ and it's sub elements that
 * follow the pattern "player__*" where "*" is the key
 * inside $els.
 */
export default (campaign) => {
    const unique = `a${random()}`;
    const html = `<div class="player__main hidden" id="${unique}">
        <div class="player__filler hidden">
            <img src="${source.path}/css/images/filler.jpg">
        </div>
        <div class="player__container hidden">
            <div class="player__overlay hidden" ${campaign.isStandard() ? `style="background-image: url(http://img.youtube.com/vi/${campaign.videos().url}/hqdefault.jpg);"` : ''}>
                <span class="player__playmain icon-play hidden"></span>
            </div>
            <div class="player__loading hidden">
              <div class="sk-cube sk-cube1"></div>
              <div class="sk-cube sk-cube2"></div>
              <div class="sk-cube sk-cube3"></div>
              <div class="sk-cube sk-cube4"></div>
              <div class="sk-cube sk-cube5"></div>
              <div class="sk-cube sk-cube6"></div>
              <div class="sk-cube sk-cube7"></div>
              <div class="sk-cube sk-cube8"></div>
              <div class="sk-cube sk-cube9"></div>
            </div>
            <div class="player__youtube hidden"></div>

            <div class="player__controls hovering hidden">
                <progress class="player__progress" min="0" max="0" value="0"></progress>
                <div class="left">
                    <span class="player__play icon-play"></span>
                    <span class="time__container">
                        <span class="player__timelive">00:00</span> / <span class="player__timetotal">00:00</span>
                    </span>
                </div>
                <div class="right">
                    <span class="player__volume icon-volume2-hold"></span>
                    <span class="player__full icon-fullscreen-hold"></span>
                </div>
            </div>
            <a href="http://a3m.io" target="_blank" class="player__logo hovering hidden"></a>
            <div class="player__share hovering hidden">
                <span class="icon-vidshareurl"></span>
                <span class="icon-vidfacebook"></span>
                <span class="icon-vidtwitter"></span>
            </div>
            <div class="player__code hidden">
                <span class="close">&#x2715;</span>
                <span>Add this code to your website</span>
                <textarea rows="2">${source.script.htmlSelf()}</textarea>
            </div>
            <span class="player__aclose hidden">&times;</span>
            <span class="player__asound icon-mute hidden"></span>
        </div>
    </div>`;

    source.script.replace(html);

    const $el = $().findId(unique);
    const $els = {};

    $el.findAll('*[class*="player__"]').forEach(function(el) {
        const matched = el.classesStr().match(/player__(\w+)(\s|$)/);

        if(matched) {
            $els[matched[1]] = el;
        }
    });

    return {
        $el,
        $els
    };
}
