import logo from './logo.svg';
import './App.css';
import React from 'react';

class App extends React.Component{
  render (){
    return (
      <div className="App">
        <div data-animation="default" data-collapse="medium" data-duration="400" data-easing="ease" data-easing2="ease" role="banner" className="navbar w-nav">
          <div className="container-3 w-container">
            <a href="#" className="brand-2 w-nav-brand"><img src="/images/Frame-15.svg" loading="lazy" alt=""/></a>
            <a href="#" className="brand w-nav-brand">
              <h3 className="s4f_h3 s4f_logo_title">send 4 fren</h3>
            </a>
            <nav role="navigation" className="nav-menu w-nav-menu">
              <a href="index.html" aria-current="page" className="s4f_nav_link w-nav-link w--current">Home</a>
              <a href="about.html" className="s4f_nav_link w-nav-link"><span>About</span></a>
              <a href="about.html" className="s4f_nav_link w-nav-link">Instructions</a>
              <a href="#mint-start" className="s4f_mint_button s4f_nav_version w-nav-link">mint now</a>
              <div className="s4f_socials_array s4f_menu w-row">
                <div className="s4f_socials w-col w-col-4"><img src="/images/Twitter-Icon.png" loading="lazy" alt=""/></div>
                <div className="s4f_socials w-col w-col-4"><img src="/images/Discord-Icon.png" loading="lazy" alt=""/></div>
                <div className="s4f_socials w-col w-col-4"><img src="/images/Instagram-Icon.png" loading="lazy" alt=""/></div>
              </div>
            </nav>
            <div className="menu-button w-nav-button">
              <div className="w-icon-nav-menu"></div>
            </div>
          </div>
        </div>
        <div className="section wf-section">
          <div className="container w-container">
            <div className="s4f_hero w-row">
              <div className="column-2 w-col w-col-6 w-col-small-6"><img src="/images/NFT_Trial.png" loading="lazy" sizes="(max-width: 479px) 100vw, (max-width: 767px) 67vw, (max-width: 991px) 461.75762939453125px, 60vw" height="" srcset="/images/NFT_Trial-p-500.png 500w, images/NFT_Trial-p-800.png 800w, images/NFT_Trial-p-1080.png 1080w, images/NFT_Trial.png 1600w" alt="" className="image"/></div>
              <div className="column w-col w-col-6 w-col-small-6">
                <h1 className="s4f_h1"><strong>Send sumthin 4 a fren or sumthin 4 urself, u lonely fuk.</strong></h1>
                <h1 className="s4f_h2">Save paper, make it last forever on the blockchain</h1>
              </div>
            </div>
            <div className="s4f_status w-row">
              <div className="s4f_banner_column w-col w-col-4">
                <h3 className="s4f_h3">Valentine&#x27;s Day Set</h3>
              </div>
              <div className="s4f_banner_column w-col w-col-4">
                <div className="columns-9 w-row">
                  <div className="w-col w-col-4">
                    <div>
                      <h1 className="s4f_h3 s4f_countdown_value">000</h1>
                    </div>
                    <div>
                      <p className="s4f_par">days</p>
                    </div>
                  </div>
                  <div className="w-col w-col-1">
                    <h1 className="s4f_h3">:</h1>
                  </div>
                  <div className="w-col w-col-3">
                    <div>
                      <h1 className="s4f_h3 s4f_countdown_value">00</h1>
                    </div>
                    <div>
                      <p className="s4f_par">hours</p>
                    </div>
                  </div>
                  <div className="w-col w-col-1">
                    <h1 className="s4f_h3">:</h1>
                  </div>
                  <div className="w-col w-col-3">
                    <div>
                      <h1 className="s4f_h3 s4f_countdown_value">00</h1>
                    </div>
                    <div>
                      <p className="s4f_par">days</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="s4f_banner_column w-col w-col-4">
                <a href="#mint-start" className="s4f_hero_button w-button">start sending</a>
              </div>
            </div>
          </div>
        </div>
        <div className="section-3 wf-section">
          <div className="div-block-9">
            <div className="s4f_socials_array w-row">
              <div className="s4f_socials w-col w-col-4"><img src="/images/Twitter-Icon.png" loading="lazy" alt=""/></div>
              <div className="s4f_socials w-col w-col-4"><img src="/images/Discord-Icon.png" loading="lazy" alt=""/></div>
              <div className="s4f_socials w-col w-col-4"><img src="/images/Instagram-Icon.png" loading="lazy" alt=""/></div>
            </div>
          </div>
        </div>
        <section id="mint-start" className="s4f_minting_start wf-section">
          <div className="w-container">
            <div className="columns-11 w-row">
              <div className="column-8 w-col w-col-6 w-col-small-6">
                <div data-hover="false" data-delay="0" className="dropdown w-dropdown">
                  <div className="dropdown-toggle w-dropdown-toggle">
                    <div className="icon w-icon-dropdown-toggle"></div>
                    <div className="text-block">Collection</div>
                  </div>
                  <nav className="dropdown-list w-dropdown-list">
                    <a href="#" className="s4f_collection_droplink w-dropdown-link">Valentine&#x27;s??Day</a>
                    <a href="#" className="s4f_collection_droplink w-dropdown-link">Birthday&#x27;s</a>
                    <a href="#" className="s4f_collection_droplink w-dropdown-link">Bachelorette</a>
                  </nav>
                </div>
                <h3 className="s4f_h3 subheading">spoil &#x27;em</h3>
                <p className="s4f_par">1402 unique Valentine???s day themed greeting cards with Nice, Naughty and Savage crypto memes to make hearts flutter, ??parts throbbing or blood boiling</p>
              </div>
              <div className="column-10 w-col w-col-6 w-col-small-6"><img src="/images/Valentines-Example.png" loading="lazy" sizes="(max-width: 479px) 100vw, (max-width: 767px) 32vw, (max-width: 991px) 247.796875px, 322px" srcset="/images/Valentines-Example-p-500.png 500w, images/Valentines-Example.png 520w" alt="" className="image-2"/></div>
            </div>
          </div>
        </section>
        <div className="s4f_mint wf-section">
          <div className="w-container">
            <h2 className="s4f_h3">choose your surprise</h2>
            <div className="div-block-5">
              <div data-current="Tab 1" data-easing="ease" data-duration-in="300" data-duration-out="100" className="s4f_tabs w-tabs">
                <div className="s4f_theme_options w-tab-menu">
                  <a data-w-tab="Tab 1" className="s4f_theme_tab w-inline-block w-tab-link w--current"><img src="/images/SWEET_ShibaCupid.png" loading="lazy" width="66" sizes="(max-width: 479px) 76vw, 66px" srcset="/images/SWEET_ShibaCupid-p-500.png 500w, images/SWEET_ShibaCupid-p-800.png 800w, images/SWEET_ShibaCupid-p-1080.png 1080w, images/SWEET_ShibaCupid-p-1600.png 1600w, images/SWEET_ShibaCupid-p-2000.png 2000w, images/SWEET_ShibaCupid.png 2258w" alt="" className="image-13"/>
                    <div className="s4f_h3">Nice</div>
                    <p className="s4f_par s4f_theme_description">Send them a sweet message they???ll be ??thinking about all day</p>
                  </a>
                  <a data-w-tab="Tab 2" className="s4f_theme_tab w-inline-block w-tab-link"><img src="/images/NAUGHTY_Ahegao.png" loading="lazy" width="62" sizes="(max-width: 479px) 76vw, 62px" srcset="/images/NAUGHTY_Ahegao-p-500.png 500w, images/NAUGHTY_Ahegao-p-800.png 800w, images/NAUGHTY_Ahegao-p-1080.png 1080w, images/NAUGHTY_Ahegao-p-1600.png 1600w, images/NAUGHTY_Ahegao-p-2000.png 2000w, images/NAUGHTY_Ahegao.png 2450w" alt="" className="image-12"/>
                    <div className="s4f_h3">Naughty</div>
                    <p className="s4f_par s4f_theme_description">Show them how they make you feel down south</p>
                  </a>
                  <a data-w-tab="Tab 3" className="s4f_theme_tab w-inline-block w-tab-link"><img src="/images/SAVAGE_AnimeWaifu.png" loading="lazy" width="71" sizes="(max-width: 479px) 76vw, 71px" srcset="/images/SAVAGE_AnimeWaifu-p-500.png 500w, images/SAVAGE_AnimeWaifu-p-800.png 800w, images/SAVAGE_AnimeWaifu-p-1080.png 1080w, images/SAVAGE_AnimeWaifu-p-1600.png 1600w, images/SAVAGE_AnimeWaifu-p-2000.png 2000w, images/SAVAGE_AnimeWaifu.png 2858w" alt="" className="image-14"/>
                    <div className="s4f_h3">Savage</div>
                    <p className="s4f_par s4f_theme_description">Roast them because you care about them</p>
                  </a>
                </div>
                <div className="w-tab-content">
                  <div data-w-tab="Tab 1" className="w-tab-pane w--tab-active"></div>
                  <div data-w-tab="Tab 2" className="w-tab-pane"></div>
                  <div data-w-tab="Tab 3" className="w-tab-pane"></div>
                </div>
              </div>
            </div>
            <h2 className="s4f_h3">for who?</h2>
            <div className="div-block-5">
              <div data-current="Tab 2" data-easing="ease" data-duration-in="300" data-duration-out="100" className="s4f_tabs s4f_tabs_mint w-tabs">
                <div className="s4f_destination w-tab-menu">
                  <a data-w-tab="Tab 1" className="s4f_destination s4f_theme_tab s4f_phone_tab w-inline-block w-tab-link">
                    <div className="s4f_h3">send 4 fren</div>
                  </a>
                  <a data-w-tab="Tab 2" className="s4f_theme_tab s4f_destination s4f_phone_tab w-inline-block w-tab-link w--current">
                    <div className="s4f_h3">send 4 me</div>
                  </a>
                </div>
                <div className="tabs-content w-tab-content">
                  <div data-w-tab="Tab 1" className="s4f_destination_mint w-tab-pane">
                    <div className="columns-7 w-row">
                      <div className="w-col w-col-6">
                        <p className="s4f_par s4f_mint_info">[number] [theme] cards remaining</p>
                      </div>
                      <div className="w-col w-col-6">
                        <p className="s4f_par">mint price [value] SOL</p>
                      </div>
                    </div>
                    <div className="form-block w-form">
                      <form id="email-form-2" name="email-form-2" data-name="Email Form 2" method="get" className="form-2"><input type="text" className="text-field-2 w-input" maxlength="256" name="destinationAddr" data-name="destinationAddr" placeholder="destination wallet address" id="destinationAddr"/><input type="submit" value="mint now" data-wait="Please wait..." data-w-id="066929d6-c593-d4f4-52dc-e0e90b7b589d" className="s4f_mint_button w-button"/></form>
                      <div className="w-form-done">
                        <div>Thank you! Your submission has been received!</div>
                      </div>
                      <div className="w-form-fail">
                        <div>Oops! Something went wrong while submitting the form.</div>
                      </div>
                    </div>
                  </div>
                  <div data-w-tab="Tab 2" className="s4f_destination_mint w-tab-pane w--tab-active">
                    <div className="columns-7 w-row">
                      <div className="w-col w-col-6">
                        <p className="s4f_par s4f_mint_info">[number] [theme] cards remaining</p>
                      </div>
                      <div className="w-col w-col-6">
                        <p className="s4f_par">mint price [value] SOL</p>
                      </div>
                    </div>
                    <div className="div-block-6">
                      <a data-w-id="80f702c3-941e-f1a2-bf39-1d1a5a546cc7" href="#" className="s4f_mint_button w-button">mint now</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="div-block-3">
              <div className="columns-6 w-row">
                <div className="s4f_minted_card w-col w-col-6"><img src="/images/Valentines-Example.png" loading="lazy" sizes="100vw" srcset="/images/Valentines-Example-p-500.png 500w, images/Valentines-Example.png 520w" alt="" className="image-3"/></div>
                <div className="column-9 w-col w-col-6">
                  <a href="#" className="s4f_sol_exp">click here to see transaction on Solana Explorer!</a>
                  <h1 className="s4f_h3">share on</h1>
                  <div className="div-block-7">
                    <a href="#" className="s4f_button twitter w-button">Twitter</a>
                    <a href="#" className="s4f_button facebook w-button">Facebook</a>
                    <a href="#" className="s4f_button messenger w-button">Messenger</a>
                    <a href="#" className="s4f_button instagram w-button">Instagram</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
