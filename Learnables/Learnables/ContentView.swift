//
//  ContentView.swift
//  Learnables
//
//  Created by Elliot Williams on 2025-07-02.
//

import SwiftUI
import WebKit

struct WebView: UIViewRepresentable {
    let url: URL
    
    func makeUIView(context: Context) -> WKWebView {
        return WKWebView()
    }
    
    func updateUIView(_ webView: WKWebView, context: Context) {
        let request = URLRequest(url: url)
        webView.load(request)
    }
}

struct ContentView: View {
    var body: some View {
        // Get URL for local HTML file
        if let url = Bundle.main.url(forResource: "index", withExtension: "html") {
            WebView(url: url)
                .edgesIgnoringSafeArea(.all) // Optional: Full-screen
        } else {
            Text("Failed to load HTML file")
                .foregroundColor(.red)
        }
    }
}

#Preview {
    ContentView()
}
