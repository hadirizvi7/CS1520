mod utils;
use wasm_bindgen::prelude::*;
use serde::{Serialize, Deserialize};
use serde_json::{Result, Value};

#[wasm_bindgen]
pub fn wasm_avg_goals(results: &JsValue) {
    
	let mut name = String::from("");
    let mut avg = 0.0;
    match results.into_serde::<Value>() {
		Ok(mut json) => {
            for i in 0..12 {
                let mut total = 0;
                for j in 0..15 {
                    let num = match json[i]["playerList"][j]["goals"].to_string().parse::<u8>() {
                        Ok(num) => num,
                        Err(_e) => 1,
                      };
                    total = total + num;
                }
                if total as f32/15.0 > avg {
                    name = json[i]["teamName"].to_string();
                    avg = total as f32/15.0;
                }
            }

		},
		Err(_) => web_sys::console::log_2(&"Could not parse this as an Example:".into(), results)
	}
    web_sys::console::log_2(&"Highest Scoring Team (RUST): ".into(), &JsValue::from_serde(&name).unwrap());
    web_sys::console::log_2(&"Average Goals Scored (RUST): ".into(), &JsValue::from_serde(&avg).unwrap());
}
