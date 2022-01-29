import { useEffect, useMemo, useState, useCallback } from 'react';
import {
    awaitTransactionSignatureConfirmation,
    CandyMachineAccount,
    CANDY_MACHINE_PROGRAM,
    getCandyMachineState,
    mintOneToken,
} from './candy-machine';
import * as anchor from '@project-serum/anchor';

// Holds the theme information. i.e. Nice, Naughty, Savage 
export interface ThemeProps {
    name: string,
    description: string
    imgSrc: string,
    imgSrcSet: string,
    id?: anchor.web3.PublicKey
}

// Props are like structs which define information 
export interface CollectionProps {
    themes: ThemeProps[],
}

type Collection = ThemeProps

const DisplayTheme: React.FC<{ collection: ThemeProps }> = ({
    collection
}) => {
    return (
        <a data-w-tab="Tab 2" className="s4f_theme_tab w-inline-block w-tab-link"><img src={collection.imgSrc}
            loading="lazy" width="62" sizes="(max-width: 479px) 76vw, 62px"
            srcSet={collection.imgSrcSet}
            alt="" className="image-12" />
            <div className="s4f_h3">{collection.name}</div>
            <p className="s4f_par s4f_theme_description">{collection.description}</p>
        </a>
    );
};

const MintAllocation: React.FC<{ collection: ThemeProps }> = ({
    collection
}) => {
    const c = collection
    return (
<div className="div-block-5">
                <h2 className="s4f_h3">for who?</h2>
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
                        <form id="email-form-2" name="email-form-2" data-name="Email Form 2" method="get" className="form-2"><input type="text" className="text-field-2 w-input" maxLength={256} name="destinationAddr" data-name="destinationAddr" placeholder="destination wallet address" id="destinationAddr"/><input type="submit" value="mint now" data-wait="Please wait..." data-w-id="066929d6-c593-d4f4-52dc-e0e90b7b589d" className="s4f_mint_button w-button"/></form>
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
    );
};

// Mint selection takes in the collection and shows the 3 themes.
// After the theme has been selected, the minting box will show. 
export const MintSelection: React.FC<{ collections: ThemeProps[] }> = ({ collections }) => {
    // Variable definitions
    const [theme, setTheme] = useState(0)

    // Returning what should be shown 
    return (
        < div className="s4f_mint wf-section" >
            <div className="w-container">
                <h2 className="s4f_h3">choose your surprise</h2>
                <div className="div-block-5">
                    <div data-current="Tab 1" data-easing="ease" data-duration-in="300" data-duration-out="100"
                        className="s4f_tabs w-tabs">
                        <div className="s4f_theme_options w-tab-menu">
                            <a data-w-tab="Tab 1" className="s4f_theme_tab w-inline-block w-tab-link w--current"><img
                                src={collections[0].imgSrc} loading="lazy" width="66" sizes="(max-width: 479px) 76vw, 66px"
                                srcSet={collections[0].imgSrcSet}
                                alt="" className="image-13" />
                                <div className="s4f_h3">{collections[0].name}</div>
                                <p className="s4f_par s4f_theme_description">{collections[0].description}</p>
                            </a>
                            <a data-w-tab="Tab 2" className="s4f_theme_tab w-inline-block w-tab-link"><img src={collections[1].imgSrc}
                                loading="lazy" width="62" sizes="(max-width: 479px) 76vw, 62px"
                                srcSet={collections[1].imgSrcSet}
                                alt="" className="image-12" />
                                <div className="s4f_h3">{collections[1].name}</div>
                                <p className="s4f_par s4f_theme_description">{collections[1].description}</p>
                            </a>
                            <a data-w-tab="Tab 3" className="s4f_theme_tab w-inline-block w-tab-link"><img
                                src={collections[2].imgSrc} loading="lazy" width="71" sizes="(max-width: 479px) 76vw, 71px"
                                srcSet={collections[2].imgSrcSet}
                                alt="" className="image-14" />
                                <div className="s4f_h3">{collections[2].name}</div>
                                <p className="s4f_par s4f_theme_description">{collections[2].description}</p>
                            </a>
                        </div>
                        <div className="w-tab-content">
                            <div data-w-tab="Tab 1" className="w-tab-pane w--tab-active">
                                <MintAllocation collection={collections[0]}></MintAllocation>
                            </div>
                            <div data-w-tab="Tab 2" className="w-tab-pane">
                                <MintAllocation collection={collections[1]}></MintAllocation>
                            </div>
                            <div data-w-tab="Tab 3" className="w-tab-pane">
                                <MintAllocation collection={collections[2]}></MintAllocation>
                            </div>
                        </div>
                    </div>

                    <div className="div-block-3">
                        <div className="columns-6 w-row">
                            <div className="s4f_minted_card w-col w-col-6"><img src="images/Valentines-Example.png" loading="lazy"
                                sizes="100vw" srcSet="images/Valentines-Example-p-500.png 500w, images/Valentines-Example.png 520w" alt=""
                                className="image-3" /></div>
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
};

export default MintSelection