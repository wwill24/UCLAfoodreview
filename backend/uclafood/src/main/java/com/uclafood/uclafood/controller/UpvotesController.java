package com.uclafood.uclafood.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.uclafood.uclafood.service.UpvotesService;

import jakarta.transaction.Transactional;

@RestController
@CrossOrigin
@RequestMapping("/upvotes")
public class UpvotesController {
  
  @Autowired
  private UpvotesService upvotesService;
  
  @PostMapping("/{userid}/{reviewid}")
  public void createUpvote(@PathVariable Long userid, @PathVariable Long reviewid) throws Exception{
    upvotesService.createUpvote(userid, reviewid);
  }

  @GetMapping("/{userid}/{reviewid}")
  public Boolean checkIfUserUpvoted(@PathVariable Long userid, @PathVariable Long reviewid) {
    return upvotesService.checkIfUserUpvoted(userid, reviewid);
  }

  @Transactional
  @DeleteMapping("/{reviewid}")
  public void deleteUpvote(@PathVariable Long reviewid) {
    upvotesService.deleteUpvote(reviewid);
  }
}


