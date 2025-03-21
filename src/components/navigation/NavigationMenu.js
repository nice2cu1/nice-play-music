import NavButton from './NavButton';

// 导入图标
import homeIcon from '../../assets/icons/lights/home.svg';
import discoverIcon from '../../assets/icons/lights/discover.svg';
import libraryIcon from '../../assets/icons/lights/library.svg';
import playerIcon from '../../assets/icons/lights/player.svg';
import settingsIcon from '../../assets/icons/lights/settings.svg';

import homeIconPressed from '../../assets/icons/lights/home_pressed.svg';
import discoverIconPressed from '../../assets/icons/lights/discover_pressed.svg';
import libraryIconPressed from '../../assets/icons/lights/library_pressed.svg';
import playerIconPressed from '../../assets/icons/lights/player_pressed.svg';
import settingsIconPressed from '../../assets/icons/lights/settings_pressed.svg';

const NavigationMenu = () => {
  return (
    <>
      {/* 主要菜单 */}
      <div style={{ marginTop: "150px" }} className="flex flex-col items-center">
        <NavButton
          id="home"
          icon={homeIcon}
          iconPressed={homeIconPressed}
        />
        <NavButton
          id="discover"
          icon={discoverIcon}
          iconPressed={discoverIconPressed}
          marginTop={36}
        />
        <NavButton
          id="library"
          icon={libraryIcon}
          iconPressed={libraryIconPressed}
          marginTop={36}
        />
      </div>

      {/* 次要菜单 */}
      <div style={{ marginTop: "150px" }} className="flex flex-col items-center">
        <NavButton
          id="player"
          icon={playerIcon}
          iconPressed={playerIconPressed}
        />
        <NavButton
          id="settings"
          icon={settingsIcon}
          iconPressed={settingsIconPressed}
          marginTop={36}
        />
      </div>
    </>
  );
};

export default NavigationMenu;
