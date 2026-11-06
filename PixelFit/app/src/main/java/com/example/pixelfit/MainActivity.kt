package com.example.pixelfit

import android.app.Activity
import android.content.ContentValues
import android.content.Intent
import android.graphics.Color
import android.net.Uri
import android.os.Bundle
import android.provider.MediaStore
import android.webkit.ValueCallback
import android.webkit.WebChromeClient
import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.webkit.WebViewAssetLoader

class MainActivity : Activity() {
    private lateinit var web: WebView
    private var fileCb: ValueCallback<Array<Uri>>? = null
    private var camUri: Uri? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        window.statusBarColor = Color.parseColor("#0a0e14")
        window.navigationBarColor = Color.parseColor("#0a0e14")
        web = WebView(this)
        web.setBackgroundColor(Color.parseColor("#0a0e14"))
        setContentView(web)
        web.settings.javaScriptEnabled = true
        web.settings.domStorageEnabled = true
        web.settings.mediaPlaybackRequiresUserGesture = false
        val loader = WebViewAssetLoader.Builder()
            .addPathHandler("/assets/", WebViewAssetLoader.AssetsPathHandler(this))
            .build()
        web.webViewClient = object : WebViewClient() {
            override fun shouldInterceptRequest(view: WebView, request: WebResourceRequest): WebResourceResponse? =
                loader.shouldInterceptRequest(request.url)
        }
        web.webChromeClient = object : WebChromeClient() {
            override fun onShowFileChooser(
                w: WebView,
                cb: ValueCallback<Array<Uri>>,
                p: FileChooserParams
            ): Boolean {
                fileCb?.onReceiveValue(null)
                fileCb = cb
                val isVideo = p.acceptTypes.joinToString().contains("video")
                val v = ContentValues()
                val camIntent: Intent
                if (isVideo) {
                    v.put(MediaStore.Video.Media.DISPLAY_NAME, "v" + System.currentTimeMillis() + ".mp4")
                    camUri = contentResolver.insert(MediaStore.Video.Media.EXTERNAL_CONTENT_URI, v)
                    camIntent = Intent(MediaStore.ACTION_VIDEO_CAPTURE)
                } else {
                    v.put(MediaStore.Images.Media.DISPLAY_NAME, "p" + System.currentTimeMillis() + ".jpg")
                    camUri = contentResolver.insert(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, v)
                    camIntent = Intent(MediaStore.ACTION_IMAGE_CAPTURE)
                }
                camIntent.putExtra(MediaStore.EXTRA_OUTPUT, camUri)
                val chooser = Intent.createChooser(p.createIntent(), "选择或拍摄")
                chooser.putExtra(Intent.EXTRA_INITIAL_INTENTS, arrayOf(camIntent))
                startActivityForResult(chooser, 1)
                return true
            }
        }
        web.loadUrl("https://appassets.androidplatform.net/assets/index.html")
    }

    @Deprecated("Deprecated in Java")
    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        if (requestCode == 1) {
            val d = data?.data
            val r: Array<Uri>? = when {
                resultCode != RESULT_OK -> null
                d != null -> arrayOf(d)
                camUri != null -> arrayOf(camUri!!)
                else -> null
            }
            fileCb?.onReceiveValue(r)
            fileCb = null
        }
    }

    @Deprecated("Deprecated in Java")
    override fun onBackPressed() {
        if (web.canGoBack()) web.goBack() else super.onBackPressed()
    }
}
