import React, { useContext } from "react";
import i18next from "../../../i18n";
import { RootContext } from "agora-chat-uikit";
import classNames from "classnames";
import { SDK_VERSION, UIKIT_VERSION } from "../../../config";
const About = () => {
  const prefixCls = "user-info";

  const context = useContext(RootContext);
  const { theme } = context;
  const themeMode = theme?.mode;
  return (
    <div
      className={classNames("setting-personal", {
        "setting-personal-dark": themeMode === "dark",
      })}
    >
      <header className="setting-personal-header">{i18next.t("about")}</header>
      <main className="setting-personal-main">
        <section className="setting-personal-content">
          <div className="user-info-content">
            <div className={`${prefixCls}-content-item`}>
              <div
                className={`${prefixCls}-content-item-box`}
                style={{ cursor: "default" }}
              >
                <span>{i18next.t("SDK Version")}</span>
                <div>{SDK_VERSION}</div>
              </div>
            </div>
            <div className={`${prefixCls}-content-item`}>
              <div
                className={`${prefixCls}-content-item-box`}
                style={{ cursor: "default" }}
              >
                <span>{i18next.t("uikitVersion")}</span>
                <div>{UIKIT_VERSION}</div>
              </div>
            </div>
            <div className={`${prefixCls}-content-item`}>
              <div
                className={`${prefixCls}-content-item-box`}
                style={{ cursor: "default" }}
              >
                <span>{i18next.t("Agora Chat documentation")}</span>
                <div title="https://docs.agora.io/en/agora-chat/overview/product-overview?platform=web">
                  <a href="https://docs.agora.io/en/agora-chat/overview/product-overview?platform=web">
                    docs.agora.io/en
                  </a>
                </div>
              </div>
            </div>
            <div className={`${prefixCls}-content-item`}>
              <div
                className={`${prefixCls}-content-item-box`}
                style={{ cursor: "default" }}
              >
                <span>{i18next.t("Contact sales")}</span>
                <div title="https://www.agora.io/en/talk-to-us/">
                  <a href="https://www.agora.io/en/talk-to-us/">
                    agora.io/en/talk-to-us
                  </a>
                </div>
              </div>
            </div>
            <div className={`${prefixCls}-content-item`}>
              <div
                className={`${prefixCls}-content-item-box`}
                style={{ cursor: "default" }}
              >
                <span>{i18next.t("Demo app github repo")}</span>
                <div title="https://github.com/AgoraIO-Usecase/AgoraChat-web">
                  <a href="https://github.com/AgoraIO-Usecase/AgoraChat-web">
                    github.com/AgoraIO
                  </a>
                </div>
              </div>
            </div>
            <div className={`${prefixCls}-content-item`}>
              <div
                className={`${prefixCls}-content-item-box`}
                style={{ cursor: "default" }}
              >
                <span>{i18next.t("More")}</span>
                <div title="https://www.agora.io/en/">
                  <a href="https://www.agora.io/en/">agora.io</a>
                </div>
              </div>
            </div>
            {/* <div className={`${prefixCls}-content-item`}>
              <div
                className={`${prefixCls}-content-item-box`}
                style={{ cursor: "default" }}
              >
                <span>{i18next.t("issues")}</span>
                <div>
                  <a href=""></a>
                </div>
              </div>
            </div> */}
          </div>
        </section>
      </main>
    </div>
  );
};

export default About;
