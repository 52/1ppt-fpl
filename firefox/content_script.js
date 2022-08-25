// WORKED FOR 22/23 SEASON

// Colors
const light_gray = "rgba(0, 0, 0, 0.3)";
const light_yellow = "rgba(255, 255, 0, 0.6)";

// Array contains list of unavailable to transfer clubs
let unavailable_clubs = [];

function collect_unavailable_to_transfer_clubs() {
    unavailable_clubs = [];

    let club_jersey_image = ".GraphicPatterns__PatternWrapMain-bfgp6c-0 picture img";
    let clubs = [];
    $(club_jersey_image).each(function() {
        clubs.push($(this).attr("alt"));
    });

    clubs.forEach( (club) => {
        if ( club && !unavailable_clubs.includes(club) ) {
            unavailable_clubs.push(club);
        }
    });
}


/* Data for options in "View By Team" dropdown select
on "Player Selection" widget on Transfers page
This value for 22/23 season is:
{
  "te_1": "Arsenal",
  "te_2": "Aston Villa",
  "te_3": "Bournemouth",
  "te_4": "Brentford",
  "te_5": "Brighton",
  "te_6": "Chelsea",
  "te_7": "Crystal Palace",
  "te_8": "Everton",
  "te_9": "Fulham",
  "te_11": "Leeds",
  "te_10": "Leicester",
  "te_12": "Liverpool",
  "te_13": "Man City",
  "te_14": "Man Utd",
  "te_15": "Newcastle",
  "te_16": "Nott'm Forest",
  "te_17": "Southampton",
  "te_18": "Spurs",
  "te_19": "West Ham",
  "te_20": "Wolves"
}
*/
let club_name_by_option_value = {};

// In the "View By Team" dropdown select on "Player Selection" widget on Transfers page,
// highlight options with clubs which already have their players picked
function highlight_options_with_selected_clubs(unavailable_clubs) {
    $("optgroup[label='By Team'] option").each(function() {
        let club_name = $(this).text();
        if ( unavailable_clubs.includes(club_name) ) {
            $(this).text(club_name + " [selected]");
        }
    });    
}

// Undo `highlight_options_with_selected_clubs` function.
// Reset options in the "View By Team" dropdown select on "Player Selection" widget
// on Transfers page to default
function reset_selected_club_options() {
    $("optgroup[label='By Team'] option").each(function() {
        let option_value = $(this).attr("value");
        $(this).text(club_name_by_option_value[option_value]);
    });
}

// On the "Player Selection" widget on Transfers page,
// add a gray background to players who unavailable to select
function grayout_players_from(unavailable_clubs) {
    const table_class = ".ElementTable-sc-1v08od9-0";
    const player_row_class = ".ElementListRow__StyledElementListRow-sc-122fdeq-0";

    $(table_class).find(player_row_class).each(function(){
        let club_name = $(this).find("img").attr("alt");
        if( unavailable_clubs.includes(club_name) ) {
            $(this).addClass("grayed-out-player");
        }
    });
}

// Undo `grayout_players_from` function
// Return "Player Selection" widget to the original state
function reset_player_selection_widget() {
    const table_class = ".ElementTable-sc-1v08od9-0";
    const player_row_class = ".ElementListRow__StyledElementListRow-sc-122fdeq-0";

    $(table_class).find(player_row_class).each(function(){
        $(this).removeClass("grayed-out-player");
    });
}

// Return HTML snippet represents list of clubs have more than 1 player and their players
// Given argument is an object with club names as keys, player names as values
// Example:
//      {
//          "Arsenal": ["Saka", "Darwin"],
//        "Liverpool": ["Salah", "Diaz"]
//      }
function list_of_invalid_clubs_and_players(invalid) {
    output_html = "<p class='error-intro'>Your team have:<p>";
    output_html += "<ul>";

    for(let club in invalid) {
        output_html += `<div class="invalid-club" data-club="${club}"><li>${invalid[club].length} ${club} players:`;
        output_html += "<ul>";

        invalid[club].forEach(player => {
            output_html += `<li>${player}</li>`;
        })
        output_html += "</ul></li></div>";
    }
    output_html += "</ul>";
    return(output_html);
}

// The change to the "Pitch View" DOM is caused by highlight/unhighlight event or not
let is_a_highlight_event = false;

// Highlight players of given club on the web page with given background color
function highlight(club, background_color) {
    const light_red = "#f7746a";
    const green = "#47cd89";
    const main_layout = $(".Layout__Main-eg6k6r-1");
    const club_img_selector = `img[alt="${club}"]`;

    main_layout.find(club_img_selector).each(function() {
        const button = $(this).parents("button");
        button.css({
            "border-radius": "4px",
            "background-color": background_color,
            "box-shadow": "rgba(0, 0, 0, 0.4) 0px 0px 0.6rem 0px"
        });

        button.find(".PitchElementData__ElementName-sc-1u4y6pr-1").css({
            "background-color": light_red,
            "color": "white",
            "border-radius": "0"
        });

        button.find(".PitchElementData__ElementValue-sc-1u4y6pr-2").css({
            "background-color": green,
        });

    });

    is_a_highlight_event = true;
}
// Undo `highlight` function
function unhighlight() {
    $("button").attr("style", "");
    $(".PitchElementData__ElementName-sc-1u4y6pr-1").attr("style", "");
    $(".PitchElementData__ElementValue-sc-1u4y6pr-2").attr("style", "");
    is_a_highlight_event = true;
}

// Check the picked team on the web page is an 1PPT team or not
function check() {
    // Un-highlight from previous check
    unhighlight();

    let club_jersey_image = ".GraphicPatterns__PatternWrapMain-bfgp6c-0 picture img";
    let class_contains_player_name = "";

    // On Pitch View
    if ( $("a[href='#pitch']").hasClass("gQWwxM") ) {
        class_contains_player_name = ".PitchElementData__ElementName-sc-1u4y6pr-1";
    } else { // On List View
        class_contains_player_name = ".ElementInTable__Name-y9xi40-1";
    }

    // Collect football clubs' names from the picked squad display on the webpage
    // with the order: top to bottom, left to right.
    // Might be duplicated
    let clubs = [];
    $(club_jersey_image).each(function() {
        clubs.push($(this).attr("alt"));
    });

    // Collect players' names form the picked squad display on the webpage
    // with the order: top to bottom, left to right,
    // correspond with the order of football clubs' names from above
    let players = [];

    $(class_contains_player_name).each(function() {
        players.push($(this).text());
    });

    // Group players' names by football club into one object.
    // Key: club's name
    // Value: array of players' name from the given club in the key
    // Example:
    //      {
    //          "Arsenal": ["Saka", "Darwin"],
    //        "Liverpool": ["Salah", "Diaz"],
    //            "Spurs": ["Kane"]
    //      }
    let squad = {};

    for (var i = 0; i < 15; i++) {
        if( clubs[i] in squad ) {
            squad[clubs[i]].push(players[i]);
        } else {
            squad[clubs[i]] = [players[i]];
        }
    }

    // Only keep the clubs that have more than 1 player in the line-up
    for (let club in squad) {
        if( squad[club].length == 1 || club == "") {
            delete squad[club];
        }
    }

    // Array of club name which has more than 1 player
    invalid_clubs = Object.keys(squad);

    // When picked squad is a valid 1PPT team
    if( invalid_clubs.length == 0 ) {
        $(".valid").removeClass('hidden');
        $(".invalid").addClass('hidden');
    } else {
        // When picked squad is an invalid 1PPT team
        $(".valid").addClass('hidden');
        $(".invalid").removeClass('hidden');
        $(".invalid-detail").html(list_of_invalid_clubs_and_players(squad));

        // Highlight invalid clubs
        invalid_clubs.forEach(club => {
            highlight(club, light_gray);
        });

        // When user clicks on a club on the invalid clubs list,
        // highlight that club on the webpage with yellow background
        let prev_clicked_club = "";
        let num_of_same_click = 0;
        $(".invalid-club").click(function() {

            let clicked_club = $(this).attr("data-club");

            // Toggle highlight if user clicked on the same club
            if ( prev_clicked_club == clicked_club ) {
                num_of_same_click += 1;
                if ( num_of_same_click % 2 == 1 ) {
                    highlight(clicked_club, light_gray);
                } else {
                    highlight(clicked_club, light_yellow);
                }
            } else {
                highlight(clicked_club, light_yellow);
                if ( prev_clicked_club ) {
                    highlight(prev_clicked_club, light_gray);
                }
                num_of_same_click = 0;
                prev_clicked_club = clicked_club;
            }
        });

    }
}

// Insert the "1PPT Team Checker" widget into sidebar after given timeout in milliseconds,
// because we have to wait for the page to be fully loaded before we can manipulate the DOM.
// This is a temporary hack, not an ideal solution.
function insert_widget_after(delay_timeout) {

    setTimeout(() => {

        const url = location.href;

        // If on Transfer Page
        if ( url.includes("transfers") ) {
            // Collect data for `club_name_by_option_value` object
            $("optgroup[label='By Team'] option").each(function() {
                let value = $(this).attr("value");
                let club_name = $(this).text();
                club_name_by_option_value[value] = club_name;
            })
        }

        if ( $("#1ppt").length == 0 ) {
            let sidebar_div = "<div class='sc-bdnxRM iVfoDK' id='1ppt'></div";

            // Transfers page has a different layout compare to Points and Pick Team page
            if ($("a[href='/transfers']").hasClass("active")) {
                $(".SquadBase__PusherSecondary-sc-16cuskw-2").prepend(sidebar_div);
            } else {
                $(".Layout__Secondary-eg6k6r-2 .sc-bdnxRM").first().after(sidebar_div);
            }

            // Load "1PPT" widget into sidebar on webpage
            $("#1ppt").load(browser.runtime.getURL("widget/widget.html"), () => {
                // Load icons
                $(".valid img").attr("src", browser.runtime.getURL("icons/green.png"));
                $(".invalid img").attr("src", browser.runtime.getURL("icons/red.png"));

                // Add "Check" button on Transfers page
                if ( url.includes("transfers") ) {
                    const button_html = "<button class='sc-bdnxRM hSnla-D Button__StyledButton-sc-1no4qep-0 eTqCza' id='check-button'>Check</button>";
                    $("#checker-body").append(button_html);

                    // Perform the check when button is clicked
                    $("#check-button").click(function() {
                        check();
                    });
                } else {
                }

                check();

                is_a_highlight_event = false;
                
                // In "Player Selection" widget on Tranfers Page,
                // grayout players from unavailable to tranfer clubs,
                // highlight options with selected clubs in "View By Team" dropdown select
                if ( location.href.includes("transfers") ) {
                    collect_unavailable_to_transfer_clubs();
                    reset_player_selection_widget();
                    grayout_players_from(unavailable_clubs);
                    reset_selected_club_options();
                    highlight_options_with_selected_clubs(unavailable_clubs);

                    // Because when users switch to List View, the Pitch View DOM is removed,
                    // so the observers are disconnected.
                    // We have to restart the observers when users switch back to Pitch View,
                    // and re-check if any transfers were made while on List View
                    $(".Tabs__TabList-sc-1e6ubpf-0").click(function(e) {
                        if( $(e.target).attr("href") == "#pitch" ) {
                            
                            setTimeout(() => {
                                collect_unavailable_to_transfer_clubs();
                                reset_player_selection_widget();
                                grayout_players_from(unavailable_clubs);
                                reset_selected_club_options();
                                highlight_options_with_selected_clubs(unavailable_clubs);
                                start_transfers_page_observers();
                            }, 300);
                        }
                    })
                }

                // Re-check when switching between Pitch View and List View
                $(".Tabs__TabList-sc-1e6ubpf-0").click(function() {
                    setTimeout(check, 300);
                })
            });
        }

    }, delay_timeout);

}

// We only allow to insert the "1PPT Team Checker" widget on Points, Pick Team,
// or Transfers page.
// This function check if the current page is one of those three pages or not
function is_on_allowed_page(url) {
    return url.includes("event") || url.includes("my-team") || url.includes("transfers");
}

// Transfer Observer
// Observe picked team ("Pitch View" DOM element)
const transfer_observer = new MutationObserver(() => {
    
    // Check if the DOM change is just a highlight/unhighlight event
    if ( is_a_highlight_event ) {
        // Reset the state variable
        is_a_highlight_event = false;
    } else {
        // The DOM change is NOT a highlight/unhighlight event
        // which means a transfer was made

        // Highlight options with selected clubs in "View By Team" select dropdown
        // on "Player Selection" widget
        collect_unavailable_to_transfer_clubs();
        reset_selected_club_options();
        highlight_options_with_selected_clubs(unavailable_clubs);

        // The `highlight_options_with_selected_clubs` function above
        // changed the DOM of "Player Selection" widget,
        // which triggered the `player_selection_observer`,
        // so we don't need to run these 2 functions:
        // 
        // reset_player_selection_widget();
        // grayout_players_from(unavailable_clubs);
    }

});

// "Player Selection" widget Observer
const player_selection_observer = new MutationObserver(() => {
    reset_player_selection_widget();
    grayout_players_from(unavailable_clubs);
});

// Start all the (MutationObserver)s on Transfers page
function start_transfers_page_observers() {
    const pitch_view = document.querySelector(".Pitch__StyledPitch-sc-1mctasb-0");
    transfer_observer.observe(pitch_view, { attributes: true, subtree: true, childList: true } );

    const player_selection_box = document.querySelectorAll(".GraphicPatterns__PatternWrap-bfgp6c-1")[1];
    player_selection_observer.observe(player_selection_box, { subtree: true, childList: true });
}

// Observer: observe when URL change
// Because the webpage is SPA, we have to observe when the URL changed
// to insert the widget only on Points, Pick Team, and Transfers page
let last_url = location.href;
const url_observer = new MutationObserver(() => {
    const url = location.href;

    // URL is changed
    if ( url !== last_url ) {
        last_url = url;

        browser.storage.sync.get("status").then((res) => {
            status = res.status;
            if( status == "on" && is_on_allowed_page(url) ) {
                insert_widget_after(500);

                // Start observers on Transfers page
                if ( url.includes("transfers") ) {
                    setTimeout(start_transfers_page_observers, 2000);
                }
            }
        })
    }
});

let status = "";

// Get the status of the extension: on or off
browser.storage.sync.get('status').then((res) => {

    status = res.status;

    if (status == "on") {

        // Only insert the widget on Points, Pick Team, and Transfers page
        if ( is_on_allowed_page(location.href) ) {

            insert_widget_after(2000);
        }

        url_observer.observe(document, { subtree: true, childList: true });

        if( location.href.includes("transfers") ) {
            setTimeout(start_transfers_page_observers, 4000);
        }
    }
});

// Listen for messege from background script
browser.runtime.onMessage.addListener((message) => {
    const url = location.href;

    if( message.status === "off") {
        url_observer.disconnect();
        unhighlight();

        // If on Transfers page
        if ( url.includes("transfers") ) {
            transfer_observer.disconnect();
            player_selection_observer.disconnect();
            reset_player_selection_widget();
            reset_selected_club_options();
        }

        // Remove the "1PPT Team Checker" widget 
        $("#1ppt").remove();
    } else {
        if ( $("#1ppt").length == 0 ) {
            // collect_unavailable_to_transfer_clubs();
            insert_widget_after(500);
            url_observer.observe(document, { subtree: true, childList: true });
            if( location.href.includes("transfers") ) {
                setTimeout(start_transfers_page_observers, 1000);
            }
        }
    }
});
