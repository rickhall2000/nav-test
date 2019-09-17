(ns my-app.views
  (:require
   [re-frame.core :as re-frame]
   [my-app.subs :as subs]
   [secretary.core :as secretary]
   ))

(defn main-panel []
  (let [name (re-frame/subscribe [::subs/name])]
    [:div
     [:h1 "Hello from " @name]
     [:a {:href "/page-1"} "click me"]
     [:br]
     [:button {:on-click
               (fn [e]
                 (.preventDefault e)
                 (secretary/dispatch! "/page-1"))}
      "Hey"]]))


(defn page-one []
  (.alert js/window "Hi from page 1")
  [:div
   [:h1 "Page One"]
   [:a {:on-click
        (fn [e]
          (.preventDefault e)
          (secretary/dispatch! "/page-2"))}
    "Page Two"]])

(defn page-two []
  [:div
   [:h1 "Page Two"]])
