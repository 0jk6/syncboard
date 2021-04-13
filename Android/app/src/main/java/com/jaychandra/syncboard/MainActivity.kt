package com.jaychandra.syncboard

import android.content.ClipData
import android.content.ClipboardManager
import android.content.Context
import android.content.SharedPreferences
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.android.volley.Request
import com.android.volley.Response
import com.android.volley.toolbox.JsonObjectRequest
import com.android.volley.toolbox.Volley
import org.json.JSONObject

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        val getBtn = findViewById<Button>(R.id.getbtn);
        val copyBtn = findViewById<Button>(R.id.copybtn);
        val updateBtn = findViewById<Button>(R.id.updatebtn);
        val saveBtn = findViewById<Button>(R.id.savebtn);

        //fill the stored api key in its respective field
        val apiKey = findViewById<EditText>(R.id.apikey);
        val sharedPrefs = getSharedPreferences("syncboard", MODE_PRIVATE)
        apiKey.setText(sharedPrefs.getString("syncboard_api_key", ""))

        //if user wants to save a new api key, then do the following
        saveBtn.setOnClickListener{
            saveApiKey(apiKey.text.toString())
        }

        //get the clipboard data from database
        getBtn.setOnClickListener {
            val key = getApiKey()
            if(key==""){
                Toast.makeText(this, "api key is required", Toast.LENGTH_SHORT).show();
            }
            else {
                getData(key.toString())
            }
        }

        //copy data to clipboard
        copyBtn.setOnClickListener{
            val data = findViewById<TextView>(R.id.result).text
            copyToClipboard(data)
            Toast.makeText(this,"copied to clipboard",Toast.LENGTH_SHORT).show()
        }

        //update data on database
        updateBtn.setOnClickListener{
            val key = getApiKey()
            if(key==""){
                Toast.makeText(this, "api key is required", Toast.LENGTH_SHORT).show()
            }
            else {
                updateData(key.toString())
            }
        }

    }

    private fun getData(apikey : String){
        val queue = Volley.newRequestQueue(this)

        val res = findViewById<TextView>(R.id.result)

        val url = "https://syncy.herokuapp.com/api/v1/getdata"

        //create a json object to send parameters
        val jsonBody = JSONObject()
        jsonBody.put("apikey", apikey)

        val jsonRequest = JsonObjectRequest(
                Request.Method.POST, url, jsonBody,
                Response.Listener<JSONObject> { response ->
                    res.text = response.get("message").toString();
                },
                Response.ErrorListener {
                    res.text = it.localizedMessage;
                })

// Add the request to the RequestQueue.
        queue.add(jsonRequest)
    }

    private fun updateData(apikey : String){
        val queue = Volley.newRequestQueue(this)

        val res = findViewById<TextView>(R.id.result)
        val data = getFromClipboard()

        val url = "https://syncy.herokuapp.com/api/v1/update"

        //create a json object to send parameters
        val jsonBody = JSONObject()
        jsonBody.put("apikey", apikey)
        jsonBody.put("data", data)

        val jsonRequest = JsonObjectRequest(
                Request.Method.POST, url, jsonBody,
                Response.Listener<JSONObject> { response ->
                    res.text = response.toString();
                },
                Response.ErrorListener {
                    res.text = it.localizedMessage;
                })

// Add the request to the RequestQueue.
        queue.add(jsonRequest)
    }

    private fun copyToClipboard(data: CharSequence){
        val clipboard = getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
        val clip = ClipData.newPlainText("label", data)
        clipboard.setPrimaryClip(clip)
    }

    private fun getFromClipboard() : String?{
        val clipboard = getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
        return clipboard.primaryClip?.getItemAt(0)?.text?.toString();
    }

    private fun saveApiKey(apiKey : String){
        val sharedPrefs = getSharedPreferences("syncboard", MODE_PRIVATE);
        val editor: SharedPreferences.Editor = sharedPrefs.edit()
        editor.putString("syncboard_api_key",apiKey);
        editor.apply();

        Toast.makeText(this,"api key saved.", Toast.LENGTH_LONG).show()
    }

    private fun getApiKey(): String? {
        val sharedPrefs = getSharedPreferences("syncboard", MODE_PRIVATE)
        return sharedPrefs.getString("syncboard_api_key", "");
    }
}